import React, { useState, useEffect } from 'react';
// import { Inertia } from '@inertiajs/react';
import { Link, router, useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/authenticated-layout';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { PlusIcon } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, HelpCircle, LayoutDashboard, FileText, BarChart2, Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

interface RolePermissions {
  administrator: boolean;
  dashboard: {
    view: boolean;
    manage: boolean;
  };
  violationRegistry: {
    view: boolean;
    create: boolean;
    edit: boolean;
    delete: boolean;
  };
  reports: {
    view: boolean;
    generate: boolean;
    create: boolean;
  };
  maintenance: {
    view: boolean;
    edit: boolean;
    manage: boolean;
  };
}

interface Role {
  id: number;
  name: string;
  permissions: RolePermissions;
  totalUsers?: number;
}

interface Props {
  roles: Role[];
  flash: {
    success?: string | null;
    error?: string | null;
  };
}

export default function Index({ roles, flash = { success: null, error: null } }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const { data, setData, post, put, processing, errors, reset } = useForm({
    name: '',
    permissions: {
      administrator: false,
      dashboard: { view: false, manage: false },
      violationRegistry: { view: false, create: false, edit: false, delete: false },
      reports: { view: false, generate: false, create: false },
      maintenance: { view: false, edit: false, manage: false }
    }
  });
  const { toast } = useToast();

  useEffect(() => {
    if (flash?.success) {
      toast({
        title: "Success",
        description: flash.success,
        variant: "default",
      });
    }
    if (flash?.error) {
      toast({
        title: "Error",
        description: flash.error,
        variant: "destructive",
      });
    }
  }, [flash?.success, flash?.error]);

  const deleteRole = (id: number) => {
    router.delete(route('roles.destroy', id), {
      onSuccess: () => {
        setShowDeleteAlert(false);
        setEditingRole(null);
      },
      onError: (errors) => {
        toast({
          title: "Error",
          description: "An error occurred while deleting the role",
          variant: "destructive",
        });
      },
    });
  };

  const handleOpenDialog = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setData({
        name: role.name,
        permissions: role.permissions
      });
    } else {
      setEditingRole(null);
      reset();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRole(null);
    reset();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRole) {
      put(route('roles.update', editingRole.id), {
        onSuccess: () => {
          handleCloseDialog();
          toast({
            title: "Success",
            description: "Role updated successfully",
          });
        },
        onError: (errors) => {
          toast({
            title: "Error",
            description: "Failed to update role. Please check the form for errors.",
            variant: "destructive",
          });
        },
      });
    } else {
      post(route('roles.store'), {
        onSuccess: () => {
          handleCloseDialog();
          toast({
            title: "Success",
            description: "Role created successfully",
          });
        },
        onError: (errors) => {
          toast({
            title: "Error",
            description: "Failed to create role. Please check the form for errors.",
            variant: "destructive",
          });
        },
      });
    }
  };

  const handleAdministratorChange = (checked: boolean) => {
    setData('permissions', {
      administrator: checked,
      dashboard: {
        view: checked,
        manage: checked
      },
      violationRegistry: {
        view: checked,
        create: checked,
        edit: checked,
        delete: checked
      },
      reports: {
        view: checked,
        generate: checked,
        create: checked
      },
      maintenance: {
        view: checked,
        edit: checked,
        manage: checked
      }
    });
  };

  const formatPermissionName = (name: string) => {
    return name.replace(/([A-Z])/g, ' $1').trim();
  };

  const getPermissionColor = (permission: string) => {
    const colors: { [key: string]: string } = {
      read: 'bg-blue-100 text-blue-700',
      write: 'bg-green-100 text-green-700',
      create: 'bg-purple-100 text-purple-700',
      delete: 'bg-red-100 text-red-700',
      manage: 'bg-orange-100 text-orange-700'
    };
    return colors[permission] || 'bg-gray-100 text-gray-700';
  };

  const permissionSections = {
    dashboard: {
      title: "Dashboard",
      icon: LayoutDashboard,
      permissions: ["view", "manage"]
    },
    violationRegistry: {
      title: "Violation Registry",
      icon: FileText,
      permissions: ["view", "create", "edit", "delete"]
    },
    reports: {
      title: "Reports & Payments",
      icon: BarChart2,
      permissions: ["view", "generate", "create"]
    },
    maintenance: {
      title: "Maintenance",
      icon: Settings,
      permissions: ["view", "edit", "manage"]
    }
  };

  const getPermissionDescription = (permission: string) => {
    const descriptions: { [key: string]: string } = {
      view: "Can view and access this section",
      create: "Can create new entries",
      edit: "Can modify existing entries",
      delete: "Can remove entries permanently",
      manage: "Full control over this section",
      generate: "Can generate reports and export data"
    };
    return descriptions[permission] || "";
  };

  const hasSectionPermissions = (role: Role, section: keyof RolePermissions) => {
    if (!role.permissions[section]) return false;
    return Object.values(role.permissions[section]).some(value => value);
  };

  return (
    <AuthenticatedLayout>
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Roles</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogContent className="max-w-4xl h-[90vh] p-0 flex flex-col bg-white dark:bg-gray-950">
              <DialogHeader className="px-8 pt-8 pb-6 flex-shrink-0 border-b">
                <DialogTitle className="text-3xl font-bold tracking-tight">
                  {editingRole ? 'Edit Role' : 'Create New Role'}
                </DialogTitle>
                <DialogDescription className="text-base">
                  {editingRole 
                    ? 'Modify the role settings and permissions below.' 
                    : 'Configure the new role by setting up its permissions.'}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
                <div className="flex-1 overflow-hidden px-8">
                  <ScrollArea className="h-full w-full">
                    <div className="space-y-8 py-6 px-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-lg font-semibold">
                            Role Name
                          </Label>
                          <p className="text-sm text-muted-foreground">
                            This is the display name for the role.
                          </p>
                        </div>
                        <Input
                          id="name"
                          placeholder="Enter role name..."
                          value={data.name}
                          onChange={(e) => setData('name', e.target.value)}
                          className="max-w-md text-lg px-4 py-2"
                        />
                        {errors.name && (
                          <p className="text-sm text-destructive mt-2">{errors.name}</p>
                        )}
                      </div>

                      <Separator className="my-8" />

                      <div className="space-y-8">
                        <div className="space-y-2">
                          <h3 className="text-xl font-semibold tracking-tight">Role Permissions</h3>
                          <p className="text-sm text-muted-foreground">
                            Define what actions users with this role can perform
                          </p>
                        </div>

                        <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20">
                          <div className="flex items-center justify-between">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-primary" />
                                <span className="text-base font-medium">Administrator Access</span>
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <button
                                        type="button"
                                        className="text-muted-foreground hover:text-primary"
                                      >
                                        <HelpCircle className="h-4 w-4" />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Grants full access to all system features and permissions</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Enable complete access to all features
                              </p>
                            </div>
                            <Switch
                              id="admin-access"
                              checked={data.permissions.administrator}
                              onCheckedChange={(checked) => handleAdministratorChange(checked)}
                              className="scale-125"
                            />
                          </div>
                        </div>

                        <Separator className="my-6" />

                        <div className="space-y-6">
                          {Object.entries(permissionSections).map(([key, section]) => (
                            <div 
                              key={key} 
                              className={`rounded-lg border ${
                                data.permissions.administrator 
                                  ? 'bg-muted/5' 
                                  : 'hover:border-primary/20'
                              } transition-all duration-200`}
                            >
                              <div className="p-4 border-b bg-secondary/5">
                                <div className="flex items-center justify-between">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                      {key === 'dashboard' && <LayoutDashboard className="h-5 w-5 text-primary" />}
                                      {key === 'violationRegistry' && <FileText className="h-5 w-5 text-primary" />}
                                      {key === 'reports' && <BarChart2 className="h-5 w-5 text-primary" />}
                                      {key === 'maintenance' && <Settings className="h-5 w-5 text-primary" />}
                                      <h4 className="text-base font-medium">{section.title}</h4>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      Configure access levels for {section.title.toLowerCase()}
                                    </p>
                                  </div>
                                  {!data.permissions.administrator && (
                                    <Button
                                      type="button"
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        const allChecked = section.permissions.every(
                                          p => {
                                            const sectionPerms = data.permissions[key as keyof RolePermissions];
                                            return typeof sectionPerms === 'object' && p in sectionPerms && sectionPerms[p as keyof typeof sectionPerms];
                                          }
                                        );
                                        setData('permissions', {
                                          ...data.permissions,
                                          [key]: section.permissions.reduce((acc, p) => ({
                                            ...acc,
                                            [p]: !allChecked
                                          }), {})
                                        });
                                      }}
                                      className="h-8 text-xs"
                                    >
                                      {section.permissions.every(p => {
                                        const sectionPerms = data.permissions[key as keyof RolePermissions];
                                        return typeof sectionPerms === 'object' && p in sectionPerms && sectionPerms[p as keyof typeof sectionPerms];
                                      })
                                        ? "Deselect all"
                                        : "Select all"}
                                    </Button>
                                  )}
                                </div>
                              </div>

                              <div className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {section.permissions.map((permission) => (
                                    <div
                                      key={permission}
                                      className={`group flex items-start gap-3 p-3 rounded-md transition-colors ${
                                        data.permissions.administrator 
                                          ? 'opacity-50' 
                                          : 'hover:bg-accent/5'
                                      }`}
                                    >
                                      <div className="flex items-center h-5 mt-0.5">
                                        <Checkbox
                                          id={`${key}-${permission}`}
                                          checked={data.permissions[key as keyof RolePermissions]?.[permission]}
                                          disabled={data.permissions.administrator}
                                          onCheckedChange={(checked) => {
                                            const section = data.permissions[key as keyof RolePermissions];
                                            if (typeof section === 'object' && permission in section) {
                                              setData('permissions', {
                                                ...data.permissions,
                                                [key]: {
                                                  ...section,
                                                  [permission]: !!checked
                                                }
                                              });
                                            }
                                          }}
                                          className="h-5 w-5 rounded-sm"
                                        />
                                      </div>
                                      <div className="space-y-1 flex-1">
                                        <Label
                                          htmlFor={`${key}-${permission}`}
                                          className={`text-sm font-medium select-none ${
                                            data.permissions.administrator 
                                              ? 'text-muted-foreground' 
                                              : 'text-foreground'
                                          } capitalize`}
                                        >
                                          {permission}
                                        </Label>
                                        <p className="text-xs text-muted-foreground">
                                          {getPermissionDescription(permission)}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>
                </div>

                <div className="flex items-center justify-end gap-3 px-8 py-6 border-t mt-auto bg-secondary/10">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCloseDialog}
                    className="px-6"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={processing}
                    className="px-6"
                  >
                    {editingRole ? 'Update Role' : 'Create Role'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role) => (
            <Card key={role.id} className="shadow-sm flex flex-col">
              <CardContent className="pt-6 flex-1">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold">{role.name}</h2>
                      <p className="text-sm text-muted-foreground mt-1">
                        {role.totalUsers} {role.totalUsers === 1 ? 'user' : 'users'}
                      </p>
                    </div>
                  </div>

                  {role.permissions.administrator && (
                    <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg p-3">
                      <Shield className="h-5 w-5 text-amber-600" />
                      <span className="text-sm font-medium text-amber-700">Administrator Access</span>
                    </div>
                  )}

                  <div className="space-y-4">
                    {Object.entries(permissionSections).map(([key, section]) => {
                      if (!hasSectionPermissions(role, key as keyof RolePermissions)) return null;
                      const sectionPermissions = role.permissions[key as keyof RolePermissions];
                      const activePermissions = Object.entries(sectionPermissions)
                        .filter(([_, value]) => value)
                        .map(([perm]) => perm);

                      return (
                        <div key={key} className="rounded-lg border bg-card p-4 transition-all hover:shadow-sm">
                          <div className="flex items-center gap-3 mb-3">
                            <section.icon className="h-5 w-5 text-primary" />
                            <h3 className="font-medium">{section.title}</h3>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {activePermissions.map((permission) => (
                              <div
                                key={permission}
                                className={`
                                  px-3 py-1 rounded-full text-xs font-medium
                                  ${permission === 'view' && 'bg-blue-50 text-blue-700 border border-blue-200'}
                                  ${permission === 'create' && 'bg-purple-50 text-purple-700 border border-purple-200'}
                                  ${permission === 'edit' && 'bg-green-50 text-green-700 border border-green-200'}
                                  ${permission === 'delete' && 'bg-red-50 text-red-700 border border-red-200'}
                                  ${permission === 'manage' && 'bg-orange-50 text-orange-700 border border-orange-200'}
                                  ${permission === 'generate' && 'bg-indigo-50 text-indigo-700 border border-indigo-200'}
                                `}
                              >
                                {permission}
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end gap-2 pt-4 mt-auto">
                <Button 
                  variant="outline" 
                  onClick={() => handleOpenDialog(role)}
                >
                  Edit
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    setEditingRole(role);
                    setShowDeleteAlert(true);
                  }}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}

          <Card 
            className="shadow-sm border-dashed cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => handleOpenDialog()}
          >
            <CardContent 
              className="h-full flex flex-col items-center justify-center py-12"
            >
              <div className="text-center space-y-2">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                  <PlusIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium">Add New Role</h3>
                <p className="text-sm text-muted-foreground">Create a new role with custom permissions</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the role
              "{editingRole?.name}" and remove it from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEditingRole(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (editingRole) {
                  deleteRole(editingRole.id);
                  setEditingRole(null);
                }
                setShowDeleteAlert(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
 
    </AuthenticatedLayout>
  );
}
