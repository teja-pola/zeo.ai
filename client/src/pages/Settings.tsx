import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Bell, 
  Lock, 
  Palette, 
  Volume2, 
  Languages, 
  Moon, 
  Sun,
  Shield,
  Smartphone,
  Mail,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  Check,
  Download, 
  Trash2,
  Camera,
  Upload,
  Phone,
  Building
} from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';

type SettingsTab = 'profile' | 'account' | 'notifications' | 'appearance' | 'privacy' | 'help';

type UserProfile = {
  name: string;
  email: string;
  avatar: string;
  bio: string;
  location: string;
  website: string;
  role: string;
  phone?: string;
  department?: string;
  languages?: string;
  isAcceptingNewSessions?: boolean;
};

type SettingsState = {
  activeTab: SettingsTab;
  profile: UserProfile;
  notifications: {
    enabled: boolean;
    email: boolean;
    push: boolean;
    sound: boolean;
    volume: number;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    language: string;
    fontSize: number;
  };
  privacy: {
    dataCollection: boolean;
    analytics: boolean;
    personalizedAds: boolean;
    activityStatus: boolean;
  };
};

interface User {
  fullName: string;
  email: string;
  universityEmail?: string;
  professionalEmail?: string;
  bio?: string;
  location?: string;
  website?: string;
  phone?: string;
  department?: string;
  languages?: string;
}

export default function Settings() {
  const [user, setUser] = useState<User | null>(null);
  const [userType, setUserType] = useState<string>('');
  
  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    const userTypeData = localStorage.getItem('userType');
    
    if (userData) {
      setUser(JSON.parse(userData));
    }
    if (userTypeData) {
      setUserType(userTypeData);
    }
  }, []);

  const [settings, setSettings] = useState<SettingsState>({
    activeTab: 'profile',
    profile: {
      name: user?.fullName || 'Enter your full name',
      email: user?.email || user?.universityEmail || user?.professionalEmail || 'Enter your email',
      avatar: '',
      bio: user?.bio || 'Tell us about yourself',
      location: user?.location || 'Enter your location',
      website: user?.website || 'Enter your website URL',
      role: userType === 'student' ? 'Student' : userType === 'counsellor' ? 'Counsellor' : 'Not specified'
    },
    notifications: {
      enabled: true,
      email: true,
      push: true,
      sound: true,
      volume: 75
    },
    appearance: {
      theme: 'system',
      language: 'en-US',
      fontSize: 16
    },
    privacy: {
      dataCollection: false,
      analytics: true,
      personalizedAds: false,
      activityStatus: true
    }
  });

  const handleSettingChange = (section: keyof Omit<SettingsState, 'activeTab' | 'profile'>, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value
      }
    }));
  };

  const handleProfileChange = (field: keyof UserProfile, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      profile: {
        ...prev.profile,
        [field]: value
      }
    }));
  };

  const setActiveTab = (tab: SettingsTab) => {
    setSettings(prev => ({ ...prev, activeTab: tab }));
  };

  const updateSettings = (section: keyof Omit<SettingsState, 'activeTab' | 'profile'>, updates: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        ...updates
      }
    }));
  };

  const tabs: { id: SettingsTab; icon: React.ReactNode; label: string }[] = [
    { id: 'profile', icon: <User className="h-5 w-5" />, label: 'Profile' },
    { id: 'account', icon: <Shield className="h-5 w-5" />, label: 'Account' },
    { id: 'notifications', icon: <Bell className="h-5 w-5" />, label: 'Notifications' },
    { id: 'appearance', icon: <Palette className="h-5 w-5" />, label: 'Appearance' },
    { id: 'privacy', icon: <Lock className="h-5 w-5" />, label: 'Privacy & Security' },
    { id: 'help', icon: <HelpCircle className="h-5 w-5" />, label: 'Help & Support' },
  ];

  // Update profile when user data changes
  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          name: user.fullName || 'Enter your full name',
          email: user.email || user.universityEmail || user.professionalEmail || 'Enter your email',
          bio: user.bio || 'Tell us about yourself',
          location: user.location || 'Enter your location', 
          website: user.website || 'Enter your website URL',
          role: userType === 'student' ? 'Student' : userType === 'counsellor' ? 'Counsellor' : 'Not specified',
          phone: user.phone || '',
          department: user.department || '',
          languages: user.languages || '',
          isAcceptingNewSessions: true
        }
      }));
    }
  }, [user, userType]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-zeo-surface via-background to-zeo-surface flex">
      {/* Main Sidebar */}
      <DashboardSidebar />
      
      {/* Settings Sidebar */}
      <div className="w-[12%] h-screen bg-card border-r flex flex-col fixed left-[14%] top-0">
        <div className="p-4 pb-2">
          <h2 className="text-lg font-bold text-gray-800">
            Settings
          </h2>
          <p className="text-xs text-muted-foreground">Manage preferences</p>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          <nav className="space-y-1 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors text-sm ${
                  settings.activeTab === tab.id
                    ? 'bg-zeo-primary/10 text-zeo-primary font-medium'
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                <span className="text-current">{tab.icon}</span>
                <span>{tab.label}</span>
                {settings.activeTab === tab.id && (
                  <ChevronRight className="ml-auto h-3 w-3" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </div>
      
      {/* Main Content - Adjusted for both sidebars */}
      <div className="ml-[25%] w-[100%] p-6">
        <div className="container mx-auto space-y-8">
          {/* Main Content */}
          <div className="overflow-y-auto">
          <motion.div
            key={settings.activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="p-4 md:p-8 max-w-4xl mx-auto"
          >
            {settings.activeTab === 'profile' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold">Profile</h2>
                  <p className="text-muted-foreground">Update your personal information</p>
                </div>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-4 mb-6">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={settings.profile.avatar} />
                        <AvatarFallback className="text-2xl bg-gradient-to-r from-zeo-primary to-zeo-secondary text-white">
                          {settings.profile.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm">Change Photo</Button>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2 mb-6">
                        <Label className='text-xl'>Role :</Label>
                        <div className="inline-block">
                          <span className="inline-block ml-1 bg-zeo-primary/20 text-zeo-primary px-4 py-2 rounded-lg font-medium text-xl border border-zeo-primary/30">
                            {settings.profile.role}
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Full Name</Label>
                        <Input 
                          value={settings.profile.name} 
                          onChange={(e) => handleProfileChange('name', e.target.value)}
                          placeholder="Enter your full name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Email</Label>
                        <div className="flex items-center space-x-2">
                          <div className="relative flex-1">
                            <Input 
                              value={settings.profile.email}
                              onChange={(e) => handleProfileChange('email', e.target.value)}
                              className="pl-10"
                              placeholder="Enter your email"
                            />
                            <Mail className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Bio</Label>
                        <textarea
                          value={settings.profile.bio}
                          onChange={(e) => handleProfileChange('bio', e.target.value)}
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          rows={3}
                          placeholder="Tell us about yourself"
                        />
                      </div>
                      
                      {/* Conditional fields based on user type */}
                      {userType === 'counsellor' ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Phone Number</Label>
                              <div className="relative">
                                <Input 
                                  value={settings.profile.phone || ''}
                                  onChange={(e) => handleProfileChange('phone', e.target.value)}
                                  className="pl-10"
                                  placeholder="Enter your phone number"
                                />
                                <Phone className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Department/Specialization</Label>
                              <div className="relative">
                                <Input 
                                  value={settings.profile.department || ''}
                                  onChange={(e) => handleProfileChange('department', e.target.value)}
                                  className="pl-10"
                                  placeholder="Enter your department"
                                />
                                <Building className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Languages Spoken</Label>
                            <div className="relative">
                              <Input 
                                value={settings.profile.languages || ''}
                                onChange={(e) => handleProfileChange('languages', e.target.value)}
                                className="pl-10"
                                placeholder="e.g., English, Spanish, French"
                              />
                              <Languages className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-[#D2E4D3] rounded-lg">
                            <div>
                              <p className="font-medium text-[#345E2C]">Accepting New Sessions</p>
                              <p className="text-sm text-[#345E2C]/70">
                                Toggle your availability for new counseling sessions
                              </p>
                            </div>
                            <Switch 
                              checked={settings.profile.isAcceptingNewSessions || false}
                              onCheckedChange={(checked) => handleProfileChange('isAcceptingNewSessions', checked)}
                              className="data-[state=checked]:bg-[#345E2C]"
                            />
                          </div>
                        </>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Location</Label>
                            <div className="relative">
                              <Input 
                                value={settings.profile.location}
                                onChange={(e) => handleProfileChange('location', e.target.value)}
                                className="pl-10"
                                placeholder="Enter your location"
                              />
                              <Globe className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Website</Label>
                            <div className="relative">
                              <Input 
                                value={settings.profile.website}
                                onChange={(e) => handleProfileChange('website', e.target.value)}
                                className="pl-10"
                                placeholder="https://yourwebsite.com"
                              />
                              <Globe className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6 flex justify-end space-x-3">
                      <Button variant="outline">Cancel</Button>
                      <Button className="bg-gradient-to-r from-zeo-primary to-zeo-secondary hover:opacity-90">
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {settings.activeTab === 'account' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold">Account</h2>
                  <p className="text-muted-foreground">Manage your account settings</p>
                </div>
                
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Change Password</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label>Current Password</Label>
                          <Input type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label>New Password</Label>
                          <Input type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label>Confirm New Password</Label>
                          <Input type="password" />
                        </div>
                      </div>
                      <Button className="mt-2">Update Password</Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Two-Factor Authentication</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">2FA</p>
                          <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium text-destructive">Danger Zone</h3>
                      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                        <div className="flex flex-col space-y-2">
                          <p className="font-medium">Delete Account</p>
                          <p className="text-sm text-muted-foreground">
                            Permanently delete your account and all associated data
                          </p>
                          <Button variant="destructive" className="mt-2 w-fit">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {settings.activeTab === 'notifications' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold">Notifications</h2>
                  <p className="text-muted-foreground">Manage how you receive notifications</p>
                </div>
                
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Enable Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about your account and activities
                          </p>
                        </div>
                        <Switch 
                          checked={settings.notifications.enabled}
                          onCheckedChange={(checked) => handleSettingChange('notifications', 'enabled', checked)}
                        />
                      </div>
                      
                      <div className="space-y-4 pl-2 border-l-2 border-muted ml-2.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">
                              Receive notifications via email
                            </p>
                          </div>
                          <Switch 
                            checked={settings.notifications.email}
                            onCheckedChange={(checked) => handleSettingChange('notifications', 'email', checked)}
                            disabled={!settings.notifications.enabled}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Push Notifications</p>
                            <p className="text-sm text-muted-foreground">
                              Receive push notifications on your device
                            </p>
                          </div>
                          <Switch 
                            checked={settings.notifications.push}
                            onCheckedChange={(checked) => handleSettingChange('notifications', 'push', checked)}
                            disabled={!settings.notifications.enabled}
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Sound</p>
                            <Switch 
                              checked={settings.notifications.sound}
                              onCheckedChange={(checked) => handleSettingChange('notifications', 'sound', checked)}
                              disabled={!settings.notifications.enabled}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label>Volume</Label>
                              <span className="text-sm text-muted-foreground">
                                {settings.notifications.volume}%
                              </span>
                            </div>
                            <Slider
                              value={[settings.notifications.volume]}
                              onValueChange={(value) => handleSettingChange('notifications', 'volume', value[0])}
                              max={100}
                              step={1}
                              disabled={!settings.notifications.enabled || !settings.notifications.sound}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Notification Preferences</h3>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Session Reminders</p>
                            <p className="text-sm text-muted-foreground">
                              Remind me about upcoming sessions
                            </p>
                          </div>
                          <Switch 
                            checked={settings.notifications.enabled}
                            disabled={!settings.notifications.enabled}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Wellness Tips</p>
                            <p className="text-sm text-muted-foreground">
                              Receive daily wellness tips and resources
                            </p>
                          </div>
                          <Switch 
                            checked={settings.notifications.enabled}
                            disabled={!settings.notifications.enabled}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Product Updates</p>
                            <p className="text-sm text-muted-foreground">
                              Get notified about new features and updates
                            </p>
                          </div>
                          <Switch 
                            checked={settings.notifications.enabled}
                            disabled={!settings.notifications.enabled}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {settings.activeTab === 'appearance' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold">Appearance</h2>
                  <p className="text-muted-foreground">Customize how ZEO looks on your device</p>
                </div>
                
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Theme</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { value: 'light', label: 'Light', icon: <Sun className="h-5 w-5" /> },
                          { value: 'dark', label: 'Dark', icon: <Moon className="h-5 w-5" /> },
                          { value: 'system', label: 'System', icon: <Smartphone className="h-5 w-5" /> }
                        ].map((theme) => (
                          <button
                            key={theme.value}
                            onClick={() => handleSettingChange('appearance', 'theme', theme.value)}
                            className={`flex flex-col items-center justify-center p-4 rounded-lg border transition-colors ${
                              settings.appearance.theme === theme.value
                                ? 'border-zeo-primary bg-zeo-primary/5'
                                : 'border-muted-foreground/20 hover:bg-muted/50'
                            }`}
                          >
                            <span className="mb-2">{theme.icon}</span>
                            <span className="text-sm">{theme.label}</span>
                            {settings.appearance.theme === theme.value && (
                              <div className="mt-2 text-zeo-primary">
                                <Check className="h-4 w-4" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Language</h3>
                      <Select 
                        value={settings.appearance.language}
                        onValueChange={(value) => updateSettings('appearance', { ...settings.appearance, language: value })}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                          <SelectItem value="te">తెలుగు (Telugu)</SelectItem>
                          <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                          <SelectItem value="kn">ಕನ್ನಡ (Kannada)</SelectItem>
                          <SelectItem value="ml">മലയാളം (Malayalam)</SelectItem>
                          <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                          <SelectItem value="bn">বাংলা (Bengali)</SelectItem>
                          <SelectItem value="gu">ગુજરાતી (Gujarati)</SelectItem>
                          <SelectItem value="pa">ਪੰਜਾਬੀ (Punjabi)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Font Size</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">A</span>
                          <Slider
                            value={[settings.appearance.fontSize]}
                            onValueChange={(value) => handleSettingChange('appearance', 'fontSize', value[0])}
                            min={12}
                            max={24}
                            step={1}
                            className="w-[200px] mx-4"
                          />
                          <span className="text-lg">A</span>
                        </div>
                        <div className="text-sm text-muted-foreground text-center">
                          {settings.appearance.fontSize}px
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {settings.activeTab === 'privacy' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold">Privacy & Security</h2>
                  <p className="text-muted-foreground">Control your privacy and security settings</p>
                </div>
                
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Data & Privacy</h3>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Data Collection</p>
                            <p className="text-sm text-muted-foreground">
                              Help improve ZEO by sharing usage data
                            </p>
                          </div>
                          <Switch 
                            checked={settings.privacy.dataCollection}
                            onCheckedChange={(checked) => handleSettingChange('privacy', 'dataCollection', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Analytics</p>
                            <p className="text-sm text-muted-foreground">
                              Allow anonymous usage analytics
                            </p>
                          </div>
                          <Switch 
                            checked={settings.privacy.analytics}
                            onCheckedChange={(checked) => handleSettingChange('privacy', 'analytics', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Personalized Ads</p>
                            <p className="text-sm text-muted-foreground">
                              Show personalized advertisements
                            </p>
                          </div>
                          <Switch 
                            checked={settings.privacy.personalizedAds}
                            onCheckedChange={(checked) => handleSettingChange('privacy', 'personalizedAds', checked)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Activity Status</p>
                            <p className="text-sm text-muted-foreground">
                              Show when you're active on ZEO
                            </p>
                          </div>
                          <Switch 
                            checked={settings.privacy.activityStatus}
                            onCheckedChange={(checked) => handleSettingChange('privacy', 'activityStatus', checked)}
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Data Management</h3>
                      
                      <div className="space-y-4">
                        <div className="rounded-lg border p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium">Download Your Data</p>
                              <p className="text-sm text-muted-foreground">
                                Download a copy of your personal data
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </Button>
                          </div>
                        </div>
                        
                        <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-medium text-destructive">Delete Account</p>
                              <p className="text-sm text-muted-foreground">
                                Permanently delete your account and all associated data
                              </p>
                            </div>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            
            {settings.activeTab === 'help' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold">Help & Support</h2>
                  <p className="text-muted-foreground">Get help and support for ZEO</p>
                </div>
                
                <Card>
                  <CardContent className="p-6 space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Help Center</h3>
                      <p className="text-muted-foreground">
                        Find answers to common questions in our help center.
                      </p>
                      <Button variant="outline" className="w-full">
                        Visit Help Center
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Contact Support</h3>
                      <p className="text-muted-foreground">
                        Can't find what you're looking for? Our support team is here to help.
                      </p>
                      <Button className="w-full bg-gradient-to-r from-zeo-primary to-zeo-secondary hover:opacity-90">
                        Contact Support
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">About ZEO</h3>
                      <div className="space-y-2 text-sm text-muted-foreground">
                        <p>Version 1.0.0</p>
                        <p>© {new Date().getFullYear()} ZEO. All rights reserved.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}  
