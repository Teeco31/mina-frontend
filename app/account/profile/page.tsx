'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, Check } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { updateMemberProfile, changeMemberPassword, formatDateShort } from '@/lib/memberApi'

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()

  const [profile, setProfile] = useState({ firstName: '', lastName: '', phone: '' })
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [profileSuccess, setProfileSuccess] = useState(false)

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwError, setPwError] = useState('')
  const [pwSuccess, setPwSuccess] = useState(false)

  useEffect(() => {
    if (user) {
      setProfile({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phone: user.phone || '',
      })
    }
  }, [user])

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess(false)
    setProfileSaving(true)
    const { error } = await updateMemberProfile(profile)
    setProfileSaving(false)
    if (error) {
      setProfileError(error)
    } else {
      await refreshUser()
      setProfileSuccess(true)
      setTimeout(() => setProfileSuccess(false), 3000)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwError('')
    setPwSuccess(false)

    if (passwords.newPassword.length < 8) {
      setPwError('New password must be at least 8 characters.')
      return
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setPwError('New passwords do not match.')
      return
    }

    setPwSaving(true)
    const { error } = await changeMemberPassword(passwords.currentPassword, passwords.newPassword)
    setPwSaving(false)

    if (error) {
      setPwError(error)
    } else {
      setPwSuccess(true)
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setPwSuccess(false), 3000)
    }
  }

  return (
    <div className="px-5 sm:px-8 md:px-10 py-10 max-w-xl">
      <div className="mb-8">
        <p
          className="text-[9px] tracking-[0.26em] uppercase text-gray-400 mb-2 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          Account
        </p>
        <h1
          className="font-playfair text-[28px] font-light text-navy"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Profile
        </h1>
        <div className="w-10 h-px bg-gold mt-3" />
      </div>

      {/* Account metadata */}
      {user && (
        <div className="mb-8 flex flex-wrap gap-x-8 gap-y-2 text-[11px] text-gray-400 font-inter"
          style={{ fontFamily: "'Inter', sans-serif" }}>
          <span>{user.email}</span>
          {user.createdAt && (
            <span>Member since {formatDateShort(user.createdAt)}</span>
          )}
        </div>
      )}

      {/* Profile form */}
      <section className="border border-gray-100 bg-white p-6 mb-6">
        <p
          className="font-playfair text-[16px] font-light text-navy mb-5"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Personal Information
        </p>

        {profileSuccess && (
          <div className="flex items-center gap-2 mb-4 p-3 border border-green-200 bg-green-50">
            <Check size={13} className="text-green-600 flex-shrink-0" />
            <p
              className="text-[12px] text-green-700 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Profile updated.
            </p>
          </div>
        )}

        {profileError && (
          <div className="flex items-start gap-2.5 mb-4 p-3 bg-red-50 border border-red-200">
            <AlertCircle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p
              className="text-[12px] text-red-600 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {profileError}
            </p>
          </div>
        )}

        <form onSubmit={handleProfileSave} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label
                className="text-[9px] tracking-[0.2em] uppercase text-gray-400 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                First Name
              </label>
              <input
                type="text"
                required
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                className="contact-input-light"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-[9px] tracking-[0.2em] uppercase text-gray-400 font-inter"
                style={{ fontFamily: "'Inter', sans-serif" }}
              >
                Last Name
              </label>
              <input
                type="text"
                required
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                className="contact-input-light"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label
              className="text-[9px] tracking-[0.2em] uppercase text-gray-400 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Phone Number
            </label>
            <input
              type="tel"
              placeholder="+234 801 234 5678"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="contact-input-light"
            />
          </div>

          <button
            type="submit"
            disabled={profileSaving}
            className="px-8 py-3 bg-gold text-navy text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-gold-light transition-colors disabled:opacity-60 cursor-pointer font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {profileSaving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </section>

      {/* Password section */}
      <section className="border border-gray-100 bg-white p-6">
        <p
          className="font-playfair text-[16px] font-light text-navy mb-5"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Change Password
        </p>

        {pwSuccess && (
          <div className="flex items-center gap-2 mb-4 p-3 border border-green-200 bg-green-50">
            <Check size={13} className="text-green-600 flex-shrink-0" />
            <p
              className="text-[12px] text-green-700 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Password updated successfully.
            </p>
          </div>
        )}

        {pwError && (
          <div className="flex items-start gap-2.5 mb-4 p-3 bg-red-50 border border-red-200">
            <AlertCircle size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
            <p
              className="text-[12px] text-red-600 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {pwError}
            </p>
          </div>
        )}

        <form onSubmit={handlePasswordChange} className="space-y-5">
          <div className="flex flex-col gap-2">
            <label
              className="text-[9px] tracking-[0.2em] uppercase text-gray-400 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Current Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              className="contact-input-light"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-[9px] tracking-[0.2em] uppercase text-gray-400 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              New Password
            </label>
            <input
              type="password"
              required
              placeholder="Minimum 8 characters"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className="contact-input-light"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-[9px] tracking-[0.2em] uppercase text-gray-400 font-inter"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Confirm New Password
            </label>
            <input
              type="password"
              required
              placeholder="Repeat new password"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              className="contact-input-light"
            />
          </div>

          <button
            type="submit"
            disabled={pwSaving}
            className="px-8 py-3 bg-navy text-white text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-navy/90 transition-colors disabled:opacity-60 cursor-pointer font-inter"
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            {pwSaving ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </section>
    </div>
  )
}
