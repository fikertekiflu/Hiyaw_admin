// src/app/(dashboard)/page.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Presentation, FolderKanban, ArrowRight, Users, BarChart3 } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";

export default function DashboardOverviewPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Hiyaw Dashboard"
        description="Oversee training sessions, manage animation projects, and nurture our creative community."
      >
        <div className="flex items-center gap-3">
          <Button asChild size="lg">
            <Link href="/dashboard/trainings/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Add Training
            </Link>
          </Button>
          <Button asChild variant="secondary" size="lg">
            <Link href="/dashboard/projects/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Add Project
            </Link>
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="flex flex-col shadow-soft hover:shadow-medium transition-shadow rounded-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-xl font-semibold text-foreground">Training Sessions</CardTitle>
              <div className="p-2.5 bg-primary/10 rounded-lg">
                <Presentation className="h-6 w-6 text-primary" />
              </div>
            </div>
            <CardDescription>Manage and schedule training content for animators.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-1">
            <p className="text-3xl font-bold text-foreground">5</p>
            <p className="text-sm text-muted-foreground">Active Sessions</p>
            <p className="text-xs text-muted-foreground pt-1">+2 this month</p>
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
               <Link href="/dashboard/trainings">
                Manage Trainings <ArrowRight className="ml-auto h-4 w-4" />
               </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col shadow-soft hover:shadow-medium transition-shadow rounded-xl">
          <CardHeader className="pb-4">
             <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-xl font-semibold text-foreground">Animation Projects</CardTitle>
              <div className="p-2.5 bg-secondary/10 rounded-lg">
                <FolderKanban className="h-6 w-6 text-secondary" />
              </div>
            </div>
            <CardDescription>Oversee production and details of Hiyaw's animations.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-1">
            <p className="text-3xl font-bold text-foreground">12</p>
            <p className="text-sm text-muted-foreground">Featured Projects</p>
            <p className="text-xs text-destructive pt-1">1 needs attention</p>
          </CardContent>
          <CardFooter>
             <Button asChild variant="outline" className="w-full">
               <Link href="/dashboard/projects">
                Manage Projects <ArrowRight className="ml-auto h-4 w-4" />
               </Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="flex flex-col shadow-soft hover:shadow-medium transition-shadow rounded-xl">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between mb-2">
              <CardTitle className="text-xl font-semibold text-foreground">Community Users</CardTitle>
              <div className="p-2.5 bg-accent/10 rounded-lg"> 
                <Users className="h-6 w-6 text-accent" />
              </div>
            </div>
            <CardDescription>Track engagement and manage user accounts.</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow space-y-1">
            <p className="text-3xl font-bold text-foreground">150</p>
            <p className="text-sm text-muted-foreground">Total Users</p>
            <p className="text-xs text-muted-foreground pt-1">+12 new users this week</p>
          </CardContent>
          <CardFooter>
             <Button asChild variant="outline" className="w-full">
               <Link href="/dashboard/users">
                Manage Users <ArrowRight className="ml-auto h-4 w-4" />
               </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}