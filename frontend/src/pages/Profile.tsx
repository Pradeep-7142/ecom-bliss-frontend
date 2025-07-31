import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, MapPin, Phone, Mail, Calendar, Package, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
  id: string;
  productName: string;
  price: number;
  quantity: number;
  image: string;
  orderDate: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
}

const Profile = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [orderHistory, setOrderHistory] = useState<OrderItem[]>([
    {
      id: '1',
      productName: 'Premium Wireless Headphones',
      price: 299,
      quantity: 1,
      image: '/placeholder.svg',
      orderDate: '2024-01-15',
      status: 'delivered',
      trackingNumber: 'TRK123456789'
    },
    {
      id: '2',
      productName: 'Smart Fitness Watch',
      price: 199,
      quantity: 2,
      image: '/placeholder.svg',
      orderDate: '2024-01-10',
      status: 'shipped',
      trackingNumber: 'TRK987654321'
    },
    {
      id: '3',
      productName: 'Bluetooth Speaker',
      price: 89,
      quantity: 1,
      image: '/placeholder.svg',
      orderDate: '2024-01-05',
      status: 'pending'
    }
  ]);

  const [editForm, setEditForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1234567890',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    pincode: '10001',
    district: 'Manhattan'
  });

  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
    setIsEditing(false);
  };

  const clearOrderHistory = () => {
    setOrderHistory([]);
    toast({
      title: "History Cleared",
      description: "Your order history has been cleared successfully.",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-500';
      case 'shipped':
        return 'bg-blue-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Please log in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
            <p className="text-muted-foreground">Manage your account and view order history</p>
          </div>
          <Button variant="outline" onClick={logout}>
            Logout
          </Button>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile Information</TabsTrigger>
            <TabsTrigger value="orders">Order History</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and contact details
                    </CardDescription>
                  </div>
                  <Button 
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
                  >
                    {isEditing ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Pincode
                    </Label>
                    <Input
                      id="pincode"
                      value={editForm.pincode}
                      onChange={(e) => setEditForm({ ...editForm, pincode: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Address Information
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Textarea
                      id="address"
                      value={editForm.address}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      disabled={!isEditing}
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={editForm.city}
                        onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        value={editForm.state}
                        onChange={(e) => setEditForm({ ...editForm, state: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <Input
                        id="district"
                        value={editForm.district}
                        onChange={(e) => setEditForm({ ...editForm, district: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="h-5 w-5" />
                      Order History
                    </CardTitle>
                    <CardDescription>
                      View all your past orders and their status
                    </CardDescription>
                  </div>
                  {orderHistory.length > 0 && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={clearOrderHistory}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear History
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {orderHistory.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium text-muted-foreground mb-2">No orders yet</p>
                    <p className="text-sm text-muted-foreground">Your order history will appear here once you make a purchase.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orderHistory.map((order) => (
                      <div key={order.id} className="border border-border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={order.image}
                              alt={order.productName}
                              className="w-16 h-16 object-cover rounded-md"
                            />
                            <div>
                              <h4 className="font-medium text-foreground">{order.productName}</h4>
                              <p className="text-sm text-muted-foreground">Quantity: {order.quantity}</p>
                              <p className="text-sm font-medium text-foreground">${order.price * order.quantity}</p>
                            </div>
                          </div>
                          <Badge className={`${getStatusColor(order.status)} text-white`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(order.orderDate).toLocaleDateString()}
                            </span>
                            {order.trackingNumber && (
                              <span>Tracking: {order.trackingNumber}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;