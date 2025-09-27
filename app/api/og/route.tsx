import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

// Edge runtime is required for @vercel/og ImageResponse to work properly
// This provides better performance for dynamic OG image generation
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get parameters from URL
    const title = searchParams.get('title') || 'Portfolio';
    const type = searchParams.get('type') || 'page';
    const tags = searchParams.get('tags')?.split(',') || [];
    const subtitle = searchParams.get('subtitle') || '';



    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            backgroundColor: '#0a0a0a',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #1a1a1a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #1a1a1a 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '80px',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              marginBottom: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                P
              </div>
              <span
                style={{
                  fontSize: '24px',
                  fontWeight: '600',
                  color: '#f8fafc',
                }}
              >
                Portfolio
              </span>
            </div>
            
            {type && (
              <div
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#1e293b',
                  borderRadius: '8px',
                  fontSize: '16px',
                  color: '#94a3b8',
                  textTransform: 'capitalize',
                }}
              >
                {type}
              </div>
            )}
          </div>

          {/* Main Content */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              flex: 1,
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <h1
              style={{
                fontSize: title.length > 50 ? '56px' : '72px',
                fontWeight: 'bold',
                color: '#f8fafc',
                lineHeight: 1.1,
                margin: 0,
                maxWidth: '100%',
                wordWrap: 'break-word',
              }}
            >
              {title}
            </h1>
            
            {subtitle && (
              <p
                style={{
                  fontSize: '24px',
                  color: '#94a3b8',
                  lineHeight: 1.4,
                  margin: 0,
                  maxWidth: '80%',
                }}
              >
                {subtitle}
              </p>
            )}
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginTop: '40px',
              }}
            >
              {tags.slice(0, 4).map((tag, index) => (
                <div
                  key={index}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#1e293b',
                    borderRadius: '20px',
                    fontSize: '16px',
                    color: '#3b82f6',
                    border: '1px solid #334155',
                  }}
                >
                  {tag}
                </div>
              ))}
            </div>
          )}

          {/* Gradient Overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '400px',
              height: '400px',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />
        </div>
      ),
      {
        width: 1200,
        height: 630,

      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}