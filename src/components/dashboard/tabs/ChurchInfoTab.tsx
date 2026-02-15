'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Save, Users } from 'lucide-react';
import { useOrganization } from '@clerk/nextjs';

interface ChurchInfoTabProps {
  orgId: string;
}

interface ChurchInfo {
  organization_id: string;
  name_en: string;
  name_es: string;
  address: string;
  phone: string;
  email: string;
  service_times_en: string;
  service_times_es: string;
  description_en: string | null;
  description_es: string | null;
  facebook_page_url: string | null;
  website_url: string | null;
  latitude: number | null;
  longitude: number | null;
}

export default function ChurchInfoTab({ orgId }: ChurchInfoTabProps) {
  const { organization } = useOrganization();
  const [churchInfo, setChurchInfo] = useState<ChurchInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchChurchInfo();
  }, [orgId]);

  const fetchChurchInfo = async () => {
    try {
      const response = await fetch(`/api/church-info?orgId=${orgId}`);
      if (response.ok) {
        const data = await response.json();
        setChurchInfo(data);
      }
    } catch (error) {
      console.error('Error fetching church info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!churchInfo) return;
    
    setSaving(true);
    try {
      const response = await fetch('/api/church-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(churchInfo),
      });

      if (response.ok) {
        alert('Church information updated successfully!');
      } else {
        alert('Failed to update church information');
      }
    } catch (error) {
      console.error('Error saving church info:', error);
      alert('Error saving church information');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof ChurchInfo, value: string) => {
    if (!churchInfo) return;
    setChurchInfo({ ...churchInfo, [field]: value });
  };

  if (loading) {
    return <div className="text-center py-8">Loading church information...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Church Information</CardTitle>
          <CardDescription>
            Manage your church details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name_en">Church Name (English)</Label>
              <Input
                id="name_en"
                value={churchInfo?.name_en || organization?.name || ''}
                onChange={(e) => updateField('name_en', e.target.value)}
                placeholder="Enter church name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name_es">Church Name (Spanish)</Label>
              <Input
                id="name_es"
                value={churchInfo?.name_es || ''}
                onChange={(e) => updateField('name_es', e.target.value)}
                placeholder="Nombre de la iglesia"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={churchInfo?.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="church@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={churchInfo?.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="service_times_en">Service Times (English)</Label>
              <Input
                id="service_times_en"
                value={churchInfo?.service_times_en || ''}
                onChange={(e) => updateField('service_times_en', e.target.value)}
                placeholder="Sunday 10:00 AM, Wednesday 7:00 PM"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="service_times_es">Service Times (Spanish)</Label>
              <Input
                id="service_times_es"
                value={churchInfo?.service_times_es || ''}
                onChange={(e) => updateField('service_times_es', e.target.value)}
                placeholder="Domingo 10:00 AM, Miércoles 7:00 PM"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={churchInfo?.address || ''}
              onChange={(e) => updateField('address', e.target.value)}
              placeholder="123 Main St, City, State 12345"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description_en">Description (English)</Label>
              <Textarea
                id="description_en"
                value={churchInfo?.description_en || ''}
                onChange={(e) => updateField('description_en', e.target.value)}
                placeholder="Tell people about your church..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description_es">Description (Spanish)</Label>
              <Textarea
                id="description_es"
                value={churchInfo?.description_es || ''}
                onChange={(e) => updateField('description_es', e.target.value)}
                placeholder="Cuéntale a la gente sobre tu iglesia..."
                rows={4}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="facebook">Facebook Page URL</Label>
              <Input
                id="facebook"
                type="url"
                value={churchInfo?.facebook_page_url || ''}
                onChange={(e) => updateField('facebook_page_url', e.target.value)}
                placeholder="https://facebook.com/yourchurch"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                type="url"
                value={churchInfo?.website_url || ''}
                onChange={(e) => updateField('website_url', e.target.value)}
                placeholder="https://yourchurch.com"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
