import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function AdminAbout() {
  const [about, setAbout] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [experienceNumber, setExperienceNumber] = useState('')
  const [experienceText, setExperienceText] = useState('')
  const [profileImageUrl, setProfileImageUrl] = useState('')
  const [aboutHeading, setAboutHeading] = useState('')
  const [aboutParagraph1, setAboutParagraph1] = useState('')
  const [aboutParagraph2, setAboutParagraph2] = useState('')

  useEffect(() => {
    loadAbout()
  }, [])

  async function loadAbout() {
    const { data } = await supabase.from('about_info').select('*').limit(1).maybeSingle()
    if (data) {
      setAbout(data)
      setExperienceNumber(data.experience_number)
      setExperienceText(data.experience_text)
      setProfileImageUrl(data.profile_image_url || '')
      setAboutHeading(data.about_heading)
      setAboutParagraph1(data.about_paragraph_1)
      setAboutParagraph2(data.about_paragraph_2)
    }
    setLoading(false)
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)

    if (about) {
      await supabase.from('about_info').update({
        experience_number: experienceNumber,
        experience_text: experienceText,
        profile_image_url: profileImageUrl || null,
        about_heading: aboutHeading,
        about_paragraph_1: aboutParagraph1,
        about_paragraph_2: aboutParagraph2,
        updated_at: new Date().toISOString(),
      }).eq('id', about.id)
    } else {
      await supabase.from('about_info').insert({
        experience_number: experienceNumber,
        experience_text: experienceText,
        profile_image_url: profileImageUrl || null,
        about_heading: aboutHeading,
        about_paragraph_1: aboutParagraph1,
        about_paragraph_2: aboutParagraph2,
      })
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    loadAbout()
  }

  if (loading) return <p className="loading">Loading...</p>

  return (
    <div>
      <h1 className="admin-page-title">Edit <span>About Section</span></h1>

      <form onSubmit={handleSave} style={{ maxWidth: '600px' }}>
        <div className="modal-form" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="modal-form-body">
            <div className="form-group">
              <label>Profile Image URL</label>
              <input
                type="url"
                value={profileImageUrl}
                onChange={(e) => setProfileImageUrl(e.target.value)}
                placeholder="https://example.com/your-photo.jpg"
              />
              <p style={{ fontSize: '0.8rem', color: 'var(--light)', marginTop: '0.5rem' }}>
                Paste a URL to your profile picture. It will appear in the About section.
              </p>
            </div>

            {profileImageUrl && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem', color: 'var(--light)' }}>Preview:</p>
                <img
                  src={profileImageUrl}
                  alt="Profile preview"
                  style={{
                    width: '150px',
                    height: '150px',
                    borderRadius: '20px',
                    objectFit: 'cover',
                    border: '2px solid rgba(108, 92, 231, 0.3)',
                  }}
                />
              </div>
            )}

            <div className="form-group">
              <label>Experience Number</label>
              <input
                type="text"
                value={experienceNumber}
                onChange={(e) => setExperienceNumber(e.target.value)}
                placeholder="1+"
                required
              />
            </div>

            <div className="form-group">
              <label>Experience Label</label>
              <input
                type="text"
                value={experienceText}
                onChange={(e) => setExperienceText(e.target.value)}
                placeholder="Years Exp."
                required
              />
            </div>

            <div className="form-group">
              <label>About Heading</label>
              <input
                type="text"
                value={aboutHeading}
                onChange={(e) => setAboutHeading(e.target.value)}
                placeholder="Passionate about creating amazing digital experiences"
                required
              />
            </div>

            <div className="form-group">
              <label>About Paragraph 1</label>
              <textarea
                value={aboutParagraph1}
                onChange={(e) => setAboutParagraph1(e.target.value)}
                placeholder="Describe yourself..."
                required
              />
            </div>

            <div className="form-group">
              <label>About Paragraph 2</label>
              <textarea
                value={aboutParagraph2}
                onChange={(e) => setAboutParagraph2(e.target.value)}
                placeholder="More about you..."
                required
              />
            </div>
          </div>
          <div className="modal-form-footer">
            {saved && (
              <span style={{ color: 'var(--secondary)', fontSize: '0.875rem', marginRight: 'auto' }}>
                Saved successfully!
              </span>
            )}
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
