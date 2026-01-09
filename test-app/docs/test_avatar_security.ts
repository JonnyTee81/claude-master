// =====================================================
// Avatar Storage Security Tests
// =====================================================
// Run this script to verify RLS policies are working correctly
// This ensures users can only access their own avatars
// =====================================================

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface TestResult {
  test: string
  passed: boolean
  message: string
  error?: any
}

const results: TestResult[] = []

// =====================================================
// Helper Functions
// =====================================================

function createTestFile(name: string, size: number = 100): File {
  const buffer = new Uint8Array(size)
  return new File([buffer], name, { type: 'image/jpeg' })
}

function logResult(test: string, passed: boolean, message: string, error?: any) {
  results.push({ test, passed, message, error })

  const icon = passed ? '✅' : '❌'
  console.log(`${icon} ${test}: ${message}`)
  if (error) {
    console.error('   Error details:', error)
  }
}

// =====================================================
// Test Suite
// =====================================================

async function runSecurityTests() {
  console.log('🔒 Starting Avatar Storage Security Tests...\n')

  // Get current authenticated user
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    console.error('❌ Not authenticated. Please log in first.')
    return
  }

  console.log(`Testing as user: ${user.id}\n`)

  // =====================================================
  // Test 1: Upload Own Avatar (Should Succeed)
  // =====================================================
  try {
    const fileName = `${user.id}.jpg`
    const testFile = createTestFile(fileName)

    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, testFile, { upsert: true })

    if (error) {
      logResult(
        'Upload Own Avatar',
        false,
        'Should be able to upload own avatar',
        error
      )
    } else {
      logResult(
        'Upload Own Avatar',
        true,
        'Successfully uploaded own avatar'
      )
    }
  } catch (error) {
    logResult(
      'Upload Own Avatar',
      false,
      'Unexpected error during upload',
      error
    )
  }

  // =====================================================
  // Test 2: Upload Other User's Avatar (Should Fail)
  // =====================================================
  try {
    const fakeUserId = '00000000-0000-0000-0000-000000000000'
    const fileName = `${fakeUserId}.jpg`
    const testFile = createTestFile(fileName)

    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, testFile, { upsert: true })

    if (error) {
      logResult(
        'Upload Other User Avatar',
        true,
        'Correctly prevented uploading other user\'s avatar'
      )
    } else {
      logResult(
        'Upload Other User Avatar',
        false,
        '🚨 SECURITY ISSUE: Able to upload other user\'s avatar!'
      )
    }
  } catch (error) {
    logResult(
      'Upload Other User Avatar',
      true,
      'Correctly prevented uploading other user\'s avatar',
      error
    )
  }

  // =====================================================
  // Test 3: View Own Avatar (Should Succeed)
  // =====================================================
  try {
    const fileName = `${user.id}.jpg`
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    // Try to fetch the URL
    const response = await fetch(publicUrl)

    if (response.ok) {
      logResult(
        'View Own Avatar',
        true,
        'Successfully retrieved own avatar URL'
      )
    } else {
      logResult(
        'View Own Avatar',
        false,
        `Could not retrieve avatar (status: ${response.status})`
      )
    }
  } catch (error) {
    logResult(
      'View Own Avatar',
      false,
      'Error retrieving own avatar',
      error
    )
  }

  // =====================================================
  // Test 4: Delete Own Avatar (Should Succeed)
  // =====================================================
  try {
    const fileName = `${user.id}.jpg`

    const { error } = await supabase.storage
      .from('avatars')
      .remove([fileName])

    if (error) {
      logResult(
        'Delete Own Avatar',
        false,
        'Should be able to delete own avatar',
        error
      )
    } else {
      logResult(
        'Delete Own Avatar',
        true,
        'Successfully deleted own avatar'
      )
    }
  } catch (error) {
    logResult(
      'Delete Own Avatar',
      false,
      'Unexpected error during deletion',
      error
    )
  }

  // =====================================================
  // Test 5: Delete Other User's Avatar (Should Fail)
  // =====================================================
  try {
    const fakeUserId = '00000000-0000-0000-0000-000000000000'
    const fileName = `${fakeUserId}.jpg`

    const { error } = await supabase.storage
      .from('avatars')
      .remove([fileName])

    if (error) {
      logResult(
        'Delete Other User Avatar',
        true,
        'Correctly prevented deleting other user\'s avatar'
      )
    } else {
      logResult(
        'Delete Other User Avatar',
        false,
        '🚨 SECURITY ISSUE: Able to delete other user\'s avatar!'
      )
    }
  } catch (error) {
    logResult(
      'Delete Other User Avatar',
      true,
      'Correctly prevented deleting other user\'s avatar',
      error
    )
  }

  // =====================================================
  // Test 6: Upload Without Authentication (Should Fail)
  // =====================================================
  // Note: This test requires signing out, which may affect other tests
  // Uncomment if you want to test this scenario

  /*
  try {
    await supabase.auth.signOut()

    const fileName = 'unauthenticated-test.jpg'
    const testFile = createTestFile(fileName)

    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, testFile)

    if (error) {
      logResult(
        'Upload Without Auth',
        true,
        'Correctly prevented unauthenticated upload'
      )
    } else {
      logResult(
        'Upload Without Auth',
        false,
        '🚨 SECURITY ISSUE: Able to upload without authentication!'
      )
    }

    // Re-authenticate for remaining tests
    // (You'll need to provide credentials here)
  } catch (error) {
    logResult(
      'Upload Without Auth',
      true,
      'Correctly prevented unauthenticated upload',
      error
    )
  }
  */

  // =====================================================
  // Test 7: Upload Invalid File Type (Should Fail)
  // =====================================================
  try {
    const fileName = `${user.id}.exe`
    const testFile = new File([new Uint8Array(100)], fileName, {
      type: 'application/x-msdownload',
    })

    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, testFile, { upsert: true })

    if (error) {
      logResult(
        'Upload Invalid File Type',
        true,
        'Correctly rejected invalid file type (bucket MIME type restriction)'
      )
    } else {
      logResult(
        'Upload Invalid File Type',
        false,
        '⚠️ WARNING: Able to upload non-image file (check bucket MIME types)'
      )
    }
  } catch (error) {
    logResult(
      'Upload Invalid File Type',
      true,
      'Correctly rejected invalid file type',
      error
    )
  }

  // =====================================================
  // Test 8: Upload Oversized File (Should Fail)
  // =====================================================
  try {
    const fileName = `${user.id}.jpg`
    const oversizedFile = createTestFile(fileName, 6 * 1024 * 1024) // 6MB

    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, oversizedFile, { upsert: true })

    if (error) {
      logResult(
        'Upload Oversized File',
        true,
        'Correctly rejected file exceeding size limit'
      )
    } else {
      logResult(
        'Upload Oversized File',
        false,
        '⚠️ WARNING: Able to upload file larger than 5MB (check bucket file_size_limit)'
      )
    }
  } catch (error) {
    logResult(
      'Upload Oversized File',
      true,
      'Correctly rejected oversized file',
      error
    )
  }

  // =====================================================
  // Test 9: List Files (Check What User Can See)
  // =====================================================
  try {
    const { data, error } = await supabase.storage
      .from('avatars')
      .list('', { limit: 100 })

    if (error) {
      logResult(
        'List Files',
        false,
        'Error listing files',
        error
      )
    } else {
      const fileCount = data?.length || 0
      logResult(
        'List Files',
        true,
        `User can see ${fileCount} files in avatars bucket`
      )

      // Check if user can see other users' files
      const otherUsersFiles = data?.filter(
        file => !file.name.startsWith(user.id)
      ) || []

      if (otherUsersFiles.length > 0) {
        console.log(`   ℹ️ Note: User can see ${otherUsersFiles.length} other users' avatars (expected for public bucket)`)
      }
    }
  } catch (error) {
    logResult(
      'List Files',
      false,
      'Unexpected error listing files',
      error
    )
  }

  // =====================================================
  // Test Summary
  // =====================================================
  console.log('\n' + '='.repeat(50))
  console.log('Test Summary')
  console.log('='.repeat(50))

  const totalTests = results.length
  const passedTests = results.filter(r => r.passed).length
  const failedTests = totalTests - passedTests

  console.log(`Total Tests: ${totalTests}`)
  console.log(`Passed: ${passedTests} ✅`)
  console.log(`Failed: ${failedTests} ❌`)
  console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`)

  if (failedTests > 0) {
    console.log('\n⚠️ Failed Tests:')
    results
      .filter(r => !r.passed)
      .forEach(r => {
        console.log(`  - ${r.test}: ${r.message}`)
      })
  }

  console.log('\n' + '='.repeat(50))

  if (failedTests === 0) {
    console.log('🎉 All security tests passed! Your avatar storage is secure.')
  } else {
    console.log('⚠️ Some tests failed. Please review RLS policies.')
  }

  return results
}

// =====================================================
// Database Verification Queries
// =====================================================

async function verifyDatabaseSetup() {
  console.log('\n🔍 Verifying Database Setup...\n')

  // Check bucket exists
  const { data: buckets, error: bucketError } = await supabase
    .from('buckets')
    .select('*')
    .eq('id', 'avatars')
    .maybeSingle()

  if (bucketError) {
    console.log('❌ Error checking bucket:', bucketError)
  } else if (!buckets) {
    console.log('❌ Avatars bucket not found!')
  } else {
    console.log('✅ Avatars bucket exists')
    console.log(`   - Public: ${buckets.public}`)
    console.log(`   - File size limit: ${buckets.file_size_limit} bytes (${(buckets.file_size_limit / 1024 / 1024).toFixed(2)} MB)`)
    console.log(`   - Allowed MIME types: ${buckets.allowed_mime_types?.join(', ') || 'Any'}`)
  }

  // Note: Checking RLS policies requires direct database access
  // This would need to be done via SQL queries in the Supabase dashboard
  console.log('\nℹ️ To verify RLS policies, run verify_avatar_storage.sql in Supabase SQL Editor')
}

// =====================================================
// Export and Run
// =====================================================

export {
  runSecurityTests,
  verifyDatabaseSetup,
}

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - expose to window
  (window as any).testAvatarSecurity = runSecurityTests;
  (window as any).verifyAvatarSetup = verifyDatabaseSetup

  console.log('Avatar security test functions loaded!')
  console.log('Run: testAvatarSecurity()')
  console.log('Run: verifyAvatarSetup()')
}

// Example usage:
// import { runSecurityTests } from './test_avatar_security'
// await runSecurityTests()
