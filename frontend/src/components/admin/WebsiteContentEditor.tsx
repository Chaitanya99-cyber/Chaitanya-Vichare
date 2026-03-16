import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { websiteContentAPI, uploadAPI } from '@/services/api';
import type { HeroContent, AboutContent, ExperienceContent, SkillsContent, ResumeContent, SiteSettings } from '@/services/api';
import { 
  Home, User, Briefcase, Award, FileText, Settings, 
  Plus, Trash2, Save, Upload, Palette 
} from 'lucide-react';
import { Switch } from '@/components/ui/switch';

const WebsiteContentEditor = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Content states
  const [heroContent, setHeroContent] = useState<Partial<HeroContent>>({});
  const [aboutContent, setAboutContent] = useState<Partial<AboutContent>>({});
  const [experienceContent, setExperienceContent] = useState<Partial<ExperienceContent>>({});
  const [skillsContent, setSkillsContent] = useState<Partial<SkillsContent>>({});
  const [resumeContent, setResumeContent] = useState<Partial<ResumeContent>>({});
  const [siteSettings, setSiteSettings] = useState<Partial<SiteSettings>>({});

  useEffect(() => {
    fetchAllContent();
  }, []);

  const fetchAllContent = async () => {
    try {
      setLoading(true);
      const [hero, about, experience, skills, resume, settings] = await Promise.all([
        websiteContentAPI.getHero(),
        websiteContentAPI.getAbout(),
        websiteContentAPI.getExperience(),
        websiteContentAPI.getSkills(),
        websiteContentAPI.getResume(),
        websiteContentAPI.getSettings(),
      ]);

      setHeroContent(hero);
      setAboutContent(about);
      setExperienceContent(experience);
      setSkillsContent(skills);
      setResumeContent(resume);
      setSiteSettings(settings);
    } catch (error) {
      console.error('Error fetching content:', error);
      toast({
        title: "Error",
        description: "Failed to load website content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveHeroContent = async () => {
    try {
      setSaving(true);
      await websiteContentAPI.updateHero(heroContent);
      toast({ title: "Success", description: "Hero section updated!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const saveAboutContent = async () => {
    try {
      setSaving(true);
      await websiteContentAPI.updateAbout(aboutContent);
      toast({ title: "Success", description: "About section updated!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const saveExperienceContent = async () => {
    try {
      setSaving(true);
      await websiteContentAPI.updateExperience(experienceContent);
      toast({ title: "Success", description: "Experience section updated!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const saveSkillsContent = async () => {
    try {
      setSaving(true);
      await websiteContentAPI.updateSkills(skillsContent);
      toast({ title: "Success", description: "Skills section updated!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const saveResumeContent = async () => {
    try {
      setSaving(true);
      await websiteContentAPI.updateResume(resumeContent);
      toast({ title: "Success", description: "Resume section updated!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const saveSiteSettings = async () => {
    try {
      setSaving(true);
      await websiteContentAPI.updateSettings(siteSettings);
      toast({ title: "Success", description: "Site settings updated!" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Website Content Editor</h2>
        <p className="text-muted-foreground">Edit all sections of your website from here</p>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="hero" className="text-xs sm:text-sm">
            <Home className="h-4 w-4 mr-1" />
            Hero
          </TabsTrigger>
          <TabsTrigger value="about" className="text-xs sm:text-sm">
            <User className="h-4 w-4 mr-1" />
            About
          </TabsTrigger>
          <TabsTrigger value="experience" className="text-xs sm:text-sm">
            <Briefcase className="h-4 w-4 mr-1" />
            Experience
          </TabsTrigger>
          <TabsTrigger value="skills" className="text-xs sm:text-sm">
            <Award className="h-4 w-4 mr-1" />
            Skills
          </TabsTrigger>
          <TabsTrigger value="resume" className="text-xs sm:text-sm">
            <FileText className="h-4 w-4 mr-1" />
            Resume
          </TabsTrigger>
          <TabsTrigger value="settings" className="text-xs sm:text-sm">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Home className="h-5 w-5" />
                Hero Section
              </CardTitle>
              <CardDescription>Edit the main landing section of your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={heroContent.title || ''}
                    onChange={(e) => setHeroContent({ ...heroContent, title: e.target.value })}
                    placeholder="Your Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subtitle</Label>
                  <Input
                    value={heroContent.subtitle || ''}
                    onChange={(e) => setHeroContent({ ...heroContent, subtitle: e.target.value })}
                    placeholder="Your Title"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={heroContent.description || ''}
                  onChange={(e) => setHeroContent({ ...heroContent, description: e.target.value })}
                  placeholder="Brief description about yourself"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>CTA Button Text</Label>
                  <Input
                    value={heroContent.cta_text || ''}
                    onChange={(e) => setHeroContent({ ...heroContent, cta_text: e.target.value })}
                    placeholder="Get In Touch"
                  />
                </div>
                <div className="space-y-2">
                  <Label>CTA Button Link</Label>
                  <Input
                    value={heroContent.cta_link || ''}
                    onChange={(e) => setHeroContent({ ...heroContent, cta_link: e.target.value })}
                    placeholder="#contact"
                  />
                </div>
              </div>

              <Button onClick={saveHeroContent} disabled={saving} className="w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Hero Section'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* About Section */}
        <TabsContent value="about">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <User className="h-5 w-5" />
                About Section
              </CardTitle>
              <CardDescription>Edit your about section content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Heading</Label>
                  <Input
                    value={aboutContent.heading || ''}
                    onChange={(e) => setAboutContent({ ...aboutContent, heading: e.target.value })}
                    placeholder="About Me"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subheading</Label>
                  <Input
                    value={aboutContent.subheading || ''}
                    onChange={(e) => setAboutContent({ ...aboutContent, subheading: e.target.value })}
                    placeholder="Professional Background"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Bio (Short)</Label>
                <Textarea
                  value={aboutContent.bio || ''}
                  onChange={(e) => setAboutContent({ ...aboutContent, bio: e.target.value })}
                  placeholder="Brief bio"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Description (Detailed)</Label>
                <Textarea
                  value={aboutContent.description || ''}
                  onChange={(e) => setAboutContent({ ...aboutContent, description: e.target.value })}
                  placeholder="Detailed description about your background"
                  rows={4}
                />
              </div>

              <Button onClick={saveAboutContent} disabled={saving} className="w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save About Section'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience Section */}
        <TabsContent value="experience">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Briefcase className="h-5 w-5" />
                Experience Section
              </CardTitle>
              <CardDescription>Manage your work experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Heading</Label>
                  <Input
                    value={experienceContent.heading || ''}
                    onChange={(e) => setExperienceContent({ ...experienceContent, heading: e.target.value })}
                    placeholder="Professional Experience"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subheading</Label>
                  <Input
                    value={experienceContent.subheading || ''}
                    onChange={(e) => setExperienceContent({ ...experienceContent, subheading: e.target.value })}
                    placeholder="Career Journey"
                  />
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 Tip: Add individual experience entries through the JSON editor or contact developer for advanced experience management UI
                </p>
              </div>

              <Button onClick={saveExperienceContent} disabled={saving} className="w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Experience Section'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Section */}
        <TabsContent value="skills">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Award className="h-5 w-5" />
                Skills Section
              </CardTitle>
              <CardDescription>Edit your skills and expertise</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Heading</Label>
                  <Input
                    value={skillsContent.heading || ''}
                    onChange={(e) => setSkillsContent({ ...skillsContent, heading: e.target.value })}
                    placeholder="Skills & Expertise"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Subheading</Label>
                  <Input
                    value={skillsContent.subheading || ''}
                    onChange={(e) => setSkillsContent({ ...skillsContent, subheading: e.target.value })}
                    placeholder="Technical Proficiencies"
                  />
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  💡 Tip: Manage skill categories and individual skills through the JSON editor
                </p>
              </div>

              <Button onClick={saveSkillsContent} disabled={saving} className="w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Skills Section'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resume Section */}
        <TabsContent value="resume">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <FileText className="h-5 w-5" />
                Resume Section
              </CardTitle>
              <CardDescription>Manage resume download section</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Heading</Label>
                <Input
                  value={resumeContent.heading || ''}
                  onChange={(e) => setResumeContent({ ...resumeContent, heading: e.target.value })}
                  placeholder="Download Resume"
                />
              </div>

              <div className="space-y-2">
                <Label>Subheading</Label>
                <Input
                  value={resumeContent.subheading || ''}
                  onChange={(e) => setResumeContent({ ...resumeContent, subheading: e.target.value })}
                  placeholder="Get My Complete Profile"
                />
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={resumeContent.description || ''}
                  onChange={(e) => setResumeContent({ ...resumeContent, description: e.target.value })}
                  placeholder="Brief description"
                  rows={2}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={resumeContent.show_section || false}
                  onCheckedChange={(checked) => setResumeContent({ ...resumeContent, show_section: checked })}
                />
                <Label>Show Resume Section on Website</Label>
              </div>

              <Button onClick={saveResumeContent} disabled={saving} className="w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Resume Section'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Site Settings */}
        <TabsContent value="settings">
          <Card className="cyber-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <Settings className="h-5 w-5" />
                Site Settings
              </CardTitle>
              <CardDescription>Configure global site settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Site Title</Label>
                <Input
                  value={siteSettings.site_title || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, site_title: e.target.value })}
                  placeholder="GRC Portfolio - Your Name"
                />
              </div>

              <div className="space-y-2">
                <Label>Footer Text</Label>
                <Input
                  value={siteSettings.footer_text || ''}
                  onChange={(e) => setSiteSettings({ ...siteSettings, footer_text: e.target.value })}
                  placeholder="© 2025 Your Name. All rights reserved."
                />
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Section Visibility</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={siteSettings.show_products_section || false}
                      onCheckedChange={(checked) => setSiteSettings({ ...siteSettings, show_products_section: checked })}
                    />
                    <Label>Show Products Section</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={siteSettings.show_certifications_section || false}
                      onCheckedChange={(checked) => setSiteSettings({ ...siteSettings, show_certifications_section: checked })}
                    />
                    <Label>Show Certifications Section</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={siteSettings.show_contact_section || false}
                      onCheckedChange={(checked) => setSiteSettings({ ...siteSettings, show_contact_section: checked })}
                    />
                    <Label>Show Contact Section</Label>
                  </div>
                </div>
              </div>

              <Button onClick={saveSiteSettings} disabled={saving} className="w-full sm:w-auto">
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save Site Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WebsiteContentEditor;
