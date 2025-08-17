"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Mail, Phone, MapPin, Calendar, Package, Heart, Settings, Camera, LogOut } from "lucide-react"
import Link from "next/link"
import { formatPKR } from "@/lib/utils"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { toast } from "react-hot-toast"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"

type UserData = {
  email: string
  avatar_url: string
  avatar_path: string
  id: string
}

function ChangePasswordForm() {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const supabase = createClientComponentClient();
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setSuccess("Password updated successfully!");
    } catch (err: any) {
      setError(err?.message || "Failed to update password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleChangePassword} className="space-y-2 max-w-sm">
      <Input
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={e => setNewPassword(e.target.value)}
        required
        disabled={loading}
        className="border-ajrak-indigo/20 focus:border-ajrak-indigo"
      />
      <div className="flex gap-2">
        <Button
          type="submit"
          variant="outline"
          className="border-ajrak-indigo text-ajrak-indigo hover:bg-ajrak-indigo hover:text-white bg-transparent"
          disabled={loading}
        >
          {loading ? "Updating..." : "Change Password"}
        </Button>
      </div>
      {error && <div className="text-red-600 text-xs">{error}</div>}
      {success && <div className="text-green-600 text-xs">{success}</div>}
    </form>
  );
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userData, setUserData] = useState<UserData>({
    email: "",
    avatar_url: "",
    avatar_path: "",
    id: "",
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [wishlistLoading, setWishlistLoading] = useState(false)
  const [wishlistError, setWishlistError] = useState<string | null>(null)

  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState<string | null>(null)

  // Profile fields
  const [profileFields, setProfileFields] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    joinDate: "",
    preferences: null as null | { newsletter?: boolean; promotions?: boolean },
  })

  // Use the custom toast hook
  const { toast: useToastNotify } = useToast();

  // Add router for logout redirect
  const router = useRouter();

  // Logout handler
  const handleLogout = async () => {
    const supabase = createClientComponentClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Logout failed");
      useToastNotify({
        variant: "destructive",
        title: "Logout Failed",
        description: error.message,
      });
    } else {
      toast.success("Logged out");
      useToastNotify({
        title: "Logged out",
        description: "You have been logged out.",
      });
      router.push("/login");
    }
  };

  // Fetch user and profile, create if not exists, get signed avatar URL
  useEffect(() => {
    const supabase = createClientComponentClient()
    const fetchUserData = async () => {
      setLoading(true)
      try {
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) throw authError || new Error('Not authenticated')

        // Fetch the user's profile from the 'profiles' table
        let profileData = null
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError && profileError.code !== "PGRST116") { // PGRST116: No rows found
          throw profileError
        }

        if (profile) {
          profileData = profile
        } else {
          // If profile doesn't exist, create one
          try {
            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert([{
                id: user.id,
                email: user.email,
                avatar_path: '',
                first_name: '',
                last_name: '',
                phone: '',
                address: '',
                join_date: new Date().toISOString().slice(0, 10), // today's date as YYYY-MM-DD
                preferences: { newsletter: false, promotions: false },
              }])
              .select()
              .single()
            if (insertError) {
              throw insertError
            } else {
              profileData = newProfile
            }
          } catch (err: any) {
            console.error('Error creating profile:', err)
            throw err
          }
        }

        // Generate signed URL for avatar if exists
        let avatarUrl = ''
        if (profileData?.avatar_path) {
          const { data: signedUrl, error: signedError } = await supabase
            .storage
            .from('avatars')
            .createSignedUrl(profileData.avatar_path, 3600)
          if (signedError) throw signedError
          avatarUrl = signedUrl.signedUrl
        }

        setUserData({
          email: profileData?.email || '',
          avatar_url: avatarUrl,
          avatar_path: profileData?.avatar_path || '',
          id: user.id
        })

        setProfileFields({
          firstName: profileData?.first_name || "",
          lastName: profileData?.last_name || "",
          phone: profileData?.phone || "",
          address: profileData?.address || "",
          joinDate: profileData?.join_date
            ? new Date(profileData.join_date).toLocaleDateString()
            : "",
          preferences: profileData?.preferences || { newsletter: false, promotions: false },
        })

        setError(null)
      } catch (err: any) {
        setError("Failed to load profile.")
        toast.error(`Error fetching profile: ${err.message}`)
        useToastNotify({
          variant: "destructive",
          title: "Profile Error",
          description: `Error fetching profile: ${err.message}`,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
    // eslint-disable-next-line
  }, [])

  // Set avatar directly
  const setAvatar = (url: string, path: string) => {
    setUserData((prev) => ({
      ...prev,
      avatar_url: url,
      avatar_path: path,
    }))
  }

  const handleAvatarButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
      fileInputRef.current.click()
    }
  }

  // Upload avatar to "avatars" bucket, update profile, get signed URL
  const uploadProfilePicture = async (file: File) => {
    setAvatarUploading(true)
    setAvatarUploadError(null)
    const supabase = createClientComponentClient()
    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `${userData.id}/avatar.${fileExt}`

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      // Update path in profile table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_path: filePath })
        .eq('id', userData.id)

      if (updateError) throw updateError

      // Get new signed URL
      const { data: signed, error: signedError } = await supabase
        .storage
        .from('avatars')
        .createSignedUrl(filePath, 3600)

      if (signedError) throw signedError

      // Use setAvatar to set avatar_url and avatar_path
      setAvatar(signed.signedUrl || '', filePath)

      toast.success('Profile picture updated!')
      useToastNotify({
        title: "Success",
        description: "Profile picture updated!",
      })
    } catch (err: any) {
      setAvatarUploadError("Failed to upload avatar. Please try again.")
      toast.error(`Upload failed: ${err.message}`)
      useToastNotify({
        variant: "destructive",
        title: "Avatar Upload Failed",
        description: `Upload failed: ${err.message}`,
      })
    } finally {
      setAvatarUploading(false)
    }
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await uploadProfilePicture(file)
  }

  // Save profile fields to Supabase
  const handleSave = async () => {
    setIsEditing(false)
    setLoading(true)
    setError(null)
    try {
      const supabase = createClientComponentClient()
      // Only update fields if userData.id is present
      if (!userData.id) {
        throw new Error("User ID is missing. Cannot update profile.")
      }
      // Defensive: Don't send undefined/null values
      const updatePayload: any = {
        first_name: profileFields.firstName ?? "",
        last_name: profileFields.lastName ?? "",
        phone: profileFields.phone ?? "",
        address: profileFields.address ?? "",
      }
      const { data, error } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', userData.id)
        .select()
      if (error) {
        // Add more details to the error message for debugging
        setError(`Failed to update profile. ${error.message || ""}`)
        toast.error(`Error updating profile: ${error.message || error}`)
        useToastNotify({
          variant: "destructive",
          title: "Profile Update Failed",
          description: `Error updating profile: ${error.message || error}`,
        })
        return
      }
      // Optionally, update local state with returned data
      if (data && data.length > 0) {
        setProfileFields((prev) => ({
          ...prev,
          firstName: data[0].first_name ?? "",
          lastName: data[0].last_name ?? "",
          phone: data[0].phone ?? "",
          address: data[0].address ?? "",
          // Do not overwrite preferences here
          preferences: prev.preferences,
        }))
      }
      toast.success("Profile updated!")
      useToastNotify({
        title: "Success",
        description: "Profile updated!",
      })
    } catch (err: any) {
      // Show more details for debugging
      setError(`Failed to update profile. ${err?.message ? err.message : ""}`)
      toast.error(`Error updating profile: ${err?.message ? err.message : err}`)
      useToastNotify({
        variant: "destructive",
        title: "Profile Update Failed",
        description: `Error updating profile: ${err?.message ? err.message : err}`,
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch orders and wishlist
  useEffect(() => {
    const supabase = createClientComponentClient()
    const fetchRecentOrders = async () => {
      setOrdersLoading(true)
      setOrdersError(null)
      try {
        const { data, error } = await supabase.from('orders')
          .select('id, date, status, total, items')
          .eq('user_id', userData.id)
          .order('date', { ascending: false })
          .limit(3)
        if (error) throw error
        setRecentOrders(data || [])
      } catch (err: any) {
        setOrdersError("Failed to fetch recent orders.")
        useToastNotify({
          variant: "destructive",
          title: "Orders Error",
          description: "Failed to fetch recent orders.",
        })
      } finally {
        setOrdersLoading(false)
      }
    }

    if (userData.id) {
      fetchRecentOrders()
    }
  }, [userData.id])

  useEffect(() => {
    const supabase = createClientComponentClient()
    const fetchWishlist = async () => {
      setWishlistLoading(true)
      setWishlistError(null)
      try {
        const { data, error } = await supabase
          .from('wishlist')
          .select('id, name, price, image')
          .eq('user_id', userData.id)
          .limit(3)
        if (error) throw error
        setWishlistItems(data || [])
      } catch (err: any) {
        setWishlistError("Failed to fetch wishlist items.")
        useToastNotify({
          variant: "destructive",
          title: "Wishlist Error",
          description: "Failed to fetch wishlist items.",
        })
      } finally {
        setWishlistLoading(false)
      }
    }

    if (userData.id) {
      fetchWishlist()
    }
  }, [userData.id])

  // Remove undefined variable usage: preferencesError
  // All error handling for preferences is inside UpdatePreferencesForm

  return (
    <div className="min-h-screen bg-gradient-to-br from-ajrak-cream/20 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="border-ajrak-indigo/20 mb-8">
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center text-ajrak-indigo">Loading profile...</div>
            ) : error ? (
              <div className="text-center text-red-600">{error}</div>
            ) : (
              <div className="flex items-center space-x-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={userData.avatar_url || "/placeholder.svg?height=100&width=100"} alt="Profile" />
                    <AvatarFallback className="bg-ajrak-indigo text-white text-2xl">
                      {(profileFields.firstName?.charAt(0) || "") + (profileFields.lastName?.charAt(0) || "")}
                    </AvatarFallback>
                  </Avatar>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleAvatarChange}
                    disabled={avatarUploading}
                  />
                  <Button
                    className="absolute -bottom-2 -right-2 w-8 h-8 p-0 bg-ajrak-indigo hover:bg-ajrak-red"
                    onClick={handleAvatarButtonClick}
                    disabled={avatarUploading}
                    aria-label="Upload new avatar"
                  >
                    {avatarUploading ? (
                      <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          fill="none"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        />
                      </svg>
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </Button>
                  {avatarUploadError && (
                    <div className="absolute left-0 right-0 -bottom-8 text-xs text-red-600 text-center">
                      {avatarUploadError}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-ajrak-indigo">
                    {profileFields.firstName} {profileFields.lastName}
                  </h1>
                  <p className="text-gray-600">{userData.email}</p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>Member since {profileFields.joinDate}</span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className="bg-ajrak-indigo text-white mb-2">Premium Member</Badge>
                  <p className="text-sm text-gray-600">Loyalty Points: 1,250</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-ajrak-cream/30">
            <TabsTrigger value="profile" className="data-[state=active]:bg-ajrak-indigo data-[state=active]:text-white">
              <User className="w-4 h-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="data-[state=active]:bg-ajrak-indigo data-[state=active]:text-white"
              asChild
            >
              <Link href="/orders">
                <Package className="w-4 h-4 mr-2" />
                Orders
              </Link>
            </TabsTrigger>
            <TabsTrigger
              value="wishlist"
              className="data-[state=active]:bg-ajrak-indigo data-[state=active]:text-white"
              asChild
            >
              <Link href="/wishlist">
                <Heart className="w-4 h-4 mr-2" />
                Wishlist
              </Link>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="data-[state=active]:bg-ajrak-indigo data-[state=active]:text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className="border-ajrak-indigo/20">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-ajrak-indigo">Personal Information</CardTitle>
                    <CardDescription>Manage your account details and preferences</CardDescription>
                  </div>
                  <Button
                    variant={isEditing ? undefined : "outline"}
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    className={
                      isEditing
                        ? "bg-ajrak-indigo hover:bg-ajrak-red"
                        : "border-ajrak-indigo text-ajrak-indigo hover:bg-ajrak-indigo hover:text-white"
                    }
                    disabled={loading || !!error}
                  >
                    {isEditing ? "Save Changes" : "Edit Profile"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="firstName"
                        value={profileFields.firstName}
                        onChange={(e) => setProfileFields({ ...profileFields, firstName: e.target.value })}
                        disabled={!isEditing || loading || !!error}
                        className="pl-10 border-ajrak-indigo/20 focus:border-ajrak-indigo"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        id="lastName"
                        value={profileFields.lastName}
                        onChange={(e) => setProfileFields({ ...profileFields, lastName: e.target.value })}
                        disabled={!isEditing || loading || !!error}
                        className="pl-10 border-ajrak-indigo/20 focus:border-ajrak-indigo"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      disabled={true}
                      className="pl-10 border-ajrak-indigo/20 focus:border-ajrak-indigo bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="phone"
                      value={profileFields.phone}
                      onChange={(e) => setProfileFields({ ...profileFields, phone: e.target.value })}
                      disabled={!isEditing || loading || !!error}
                      className="pl-10 border-ajrak-indigo/20 focus:border-ajrak-indigo"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="address"
                      value={profileFields.address}
                      onChange={(e) => setProfileFields({ ...profileFields, address: e.target.value })}
                      disabled={!isEditing || loading || !!error}
                      className="pl-10 border-ajrak-indigo/20 focus:border-ajrak-indigo"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab (now just a placeholder, actual content is on /orders) */}
          <TabsContent value="orders">
            <Card className="border-ajrak-indigo/20">
              <CardHeader>
                <CardTitle className="text-ajrak-indigo">Order History</CardTitle>
                <CardDescription>Track your recent purchases and order status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="border border-ajrak-indigo/10 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-ajrak-indigo">Order {order.id}</h3>
                          <p className="text-sm text-gray-600">{order.date}</p>
                        </div>
                        <div className="text-right">
                          <Badge
                            className={
                              order.status === "Delivered"
                                ? "bg-green-500"
                                : order.status === "Shipped"
                                ? "bg-blue-500"
                                : "bg-yellow-500"
                            }
                          >
                            {order.status}
                          </Badge>
                          <p className="text-lg font-bold text-ajrak-indigo mt-1">{formatPKR(order.total)}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">Items: {Array.isArray(order.items) ? order.items.join(", ") : order.items}</p>
                      <div className="mt-4 text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/orders`}>View Details</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button asChild className="bg-ajrak-indigo hover:bg-ajrak-red">
                    <Link href="/orders">View All Orders</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wishlist Tab (now just a placeholder, actual content is on /wishlist) */}
          <TabsContent value="wishlist">
            <Card className="border-ajrak-indigo/20">
              <CardHeader>
                <CardTitle className="text-ajrak-indigo">My Wishlist</CardTitle>
                <CardDescription>Your saved favorite items</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {wishlistItems.map((item) => (
                    <div
                      key={item.id}
                      className="border border-ajrak-indigo/10 rounded-lg p-4 flex items-center space-x-4"
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-ajrak-indigo">{item.name}</h3>
                        <p className="text-sm text-gray-600">{formatPKR(item.price)}</p>
                      </div>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/wishlist`}>View Item</Link>
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <Button asChild className="bg-ajrak-indigo hover:bg-ajrak-red">
                    <Link href="/wishlist">View Full Wishlist</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="border-ajrak-indigo/20">
              <CardHeader>
                <CardTitle className="text-ajrak-indigo">Account Settings</CardTitle>
                <CardDescription>Manage your account preferences and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Change Password Section */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Password</h3>
                  <p className="text-gray-600 text-sm mb-4">Change your password to keep your account secure.</p>
                  <ChangePasswordForm />
                </div>
                {/* Removed Email Preferences Section */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Logout</h3>
                  <p className="text-gray-600 text-sm mb-4">Sign out of your account.</p>
                  <Button variant="outline" className="border-ajrak-indigo text-ajrak-indigo hover:bg-ajrak-indigo hover:text-white bg-transparent flex items-center gap-2" onClick={handleLogout}>
                    <LogOut className="w-4 h-4" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
