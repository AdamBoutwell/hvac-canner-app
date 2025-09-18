import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { EquipmentData, Customer } from '@/types/equipment';

// Initialize Firebase Admin if not already initialized
if (!getApps().length) {
  initializeApp();
}

const db = getFirestore();
const storage = getStorage();

export async function POST(request: NextRequest) {
  try {
    const { 
      projectName, 
      customer, 
      equipmentList, 
      photos 
    } = await request.json() as {
      projectName: string;
      customer: Customer;
      equipmentList: EquipmentData[];
      photos: Array<{
        id: string;
        name: string;
        data: string; // base64 data
        equipmentId?: string; // link to specific equipment
      }>;
    };

    if (!projectName || !customer) {
      return NextResponse.json(
        { error: 'Project name and customer information are required' },
        { status: 400 }
      );
    }

    // Create project document
    const projectRef = db.collection('projects').doc();
    const projectId = projectRef.id;
    
    const projectData = {
      id: projectId,
      projectName: projectName.trim(),
      customer: {
        name: customer.name?.trim() || '',
        location: customer.location?.trim() || '',
        contact: customer.contact?.trim() || '',
        phone: customer.phone?.trim() || '',
        email: customer.email?.trim() || ''
      },
      equipmentList: equipmentList.map(equipment => ({
        ...equipment,
        id: equipment.id || `eq_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      })),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 'active',
      totalEquipment: equipmentList.length,
      totalQuantity: equipmentList.reduce((sum, eq) => sum + (eq.qty || 1), 0)
    };

    // Save project to Firestore
    await projectRef.set(projectData);

    // Upload photos to Firebase Storage
    const photoUrls: string[] = [];
    
    if (photos && photos.length > 0) {
      const bucket = storage.bucket();
      
      for (const photo of photos) {
        try {
          // Create folder structure: projects/{projectId}/photos/{photoId}
          const fileName = `projects/${projectId}/photos/${photo.id}_${photo.name}`;
          
          // Convert base64 to buffer
          const base64Data = photo.data.replace(/^data:image\/\w+;base64,/, '');
          const buffer = Buffer.from(base64Data, 'base64');
          
          // Upload to Firebase Storage
          const file = bucket.file(fileName);
          await file.save(buffer, {
            metadata: {
              contentType: 'image/jpeg',
              metadata: {
                projectId,
                equipmentId: photo.equipmentId || '',
                uploadedAt: new Date().toISOString()
              }
            }
          });

          // Get public URL
          const [url] = await file.getSignedUrl({
            action: 'read',
            expires: '03-01-2500' // Far future date
          });

          photoUrls.push(url);

          // Update equipment with photo reference if linked
          if (photo.equipmentId) {
            const equipmentIndex = projectData.equipmentList.findIndex(
              eq => eq.id === photo.equipmentId
            );
            if (equipmentIndex !== -1) {
              projectData.equipmentList[equipmentIndex].photoUrl = url;
              projectData.equipmentList[equipmentIndex].photoId = photo.id;
            }
          }
        } catch (photoError) {
          console.error(`Error uploading photo ${photo.id}:`, photoError);
          // Continue with other photos even if one fails
        }
      }

      // Update project with photo URLs
      await projectRef.update({
        photoUrls,
        photoCount: photos.length,
        updatedAt: new Date()
      });
    }

    return NextResponse.json({
      success: true,
      projectId,
      message: `Project "${projectName}" saved successfully with ${equipmentList.length} equipment items and ${photos?.length || 0} photos`
    });

  } catch (error) {
    console.error('Error saving project:', error);
    return NextResponse.json(
      { error: 'Failed to save project to cloud storage' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const adminKey = searchParams.get('adminKey');

    // Simple admin key check (you should use proper authentication)
    if (adminKey !== 'admin123') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (projectId) {
      // Get specific project
      const projectDoc = await db.collection('projects').doc(projectId).get();
      
      if (!projectDoc.exists) {
        return NextResponse.json(
          { error: 'Project not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        project: { id: projectDoc.id, ...projectDoc.data() }
      });
    } else {
      // Get all projects
      const projectsSnapshot = await db.collection('projects')
        .orderBy('createdAt', 'desc')
        .limit(50)
        .get();

      const projects = projectsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      return NextResponse.json({
        success: true,
        projects,
        total: projects.length
      });
    }

  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}
