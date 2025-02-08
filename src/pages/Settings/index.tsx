import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Ruler } from "lucide-react";

const Settings: React.FC = () => {
  const settingsOptions = [
    {
      title: "Custom Units",
      description: "Manage custom measurement units for inventory items",
      icon: <Ruler className="h-6 w-6" />,
      href: "/settings/custom-units",
    },
    // Add more settings options here as needed
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsOptions.map((option) => (
          <Link key={option.href} to={option.href}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center gap-4">
                {option.icon}
                <div>
                  <CardTitle>{option.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {option.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Settings; 