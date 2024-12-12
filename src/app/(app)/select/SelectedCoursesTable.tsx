"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatRating } from "@/lib/utils";
import { removeCourseSelectionAction } from "@/server/actions";
import { type Course } from "@/types/course";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useOptimistic, useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { CourseHoverLink } from "./CourseHoverLink";

type SortDirection = "asc" | "desc" | null;
type SortColumn =
  | "code"
  | "name"
  | "useful"
  | "liked"
  | "easy"
  | "numRatings"
  | null;

type FixedCourseWithItem = {
  courseItemId: string;
  course: Course;
};

type CourseTableProps = {
  fixedCourses: FixedCourseWithItem[];
};

export function SelectedCoursesTable({ fixedCourses }: CourseTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>("code");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [optimisticFixedCourses, removeOptimisticFixedCourse] = useOptimistic(
    fixedCourses,
    (currentFixedCourses, courseId: string) => {
      const newState = currentFixedCourses.filter(
        (c) => c.course.id !== courseId,
      );
      return newState;
    },
  );
  const [, startTransition] = useTransition();

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection((curr) =>
        curr === "asc" ? "desc" : curr === "desc" ? null : "asc",
      );
      if (sortDirection === "desc") {
        setSortColumn(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getSortIcon = (column: SortColumn) => {
    if (sortColumn !== column) return <ArrowUpDown className="h-4 w-4" />;
    if (sortDirection === "asc") return <ArrowUp className="h-4 w-4" />;
    if (sortDirection === "desc") return <ArrowDown className="h-4 w-4" />;
    return <ArrowUpDown className="h-4 w-4" />;
  };

  const sortCourses = (courses: FixedCourseWithItem[]) => {
    const getCourseYear = (code: string | null) => {
      const match = code?.match(/\d+/);
      return match ? parseInt(match[0]) : 0;
    };

    if (!sortColumn || !sortDirection)
      return [...courses].sort((a, b) => {
        return getCourseYear(a.course.code) - getCourseYear(b.course.code);
      });

    return [...courses].sort((a, b) => {
      const courseA = a.course;
      const courseB = b.course;

      const multiplier = sortDirection === "asc" ? 1 : -1;

      switch (sortColumn) {
        case "code":
          return (
            (courseA.code ?? "").localeCompare(courseB.code ?? "") * multiplier
          );
        case "name":
          return (
            (courseA.name ?? "").localeCompare(courseB.name ?? "") * multiplier
          );
        case "useful":
          return (
            (Number(courseA.usefulRating ?? 0) -
              Number(courseB.usefulRating ?? 0)) *
            multiplier
          );
        case "liked":
          return (
            (Number(courseA.likedRating ?? 0) -
              Number(courseB.likedRating ?? 0)) *
            multiplier
          );
        case "easy":
          return (
            (Number(courseA.easyRating ?? 0) -
              Number(courseB.easyRating ?? 0)) *
            multiplier
          );
        case "numRatings":
          return (
            ((courseA.numRatings ?? 0) - (courseB.numRatings ?? 0)) * multiplier
          );
        default:
          return 0;
      }
    });
  };

  const sortedFixedCourses = sortCourses(optimisticFixedCourses);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-1/12">Remove</TableHead>
            <TableHead className="w-2/12">
              <Button
                variant="ghost"
                onClick={() => handleSort("code")}
                className="flex h-8 items-center gap-1"
              >
                Code {fixedCourses.length > 0 && getSortIcon("code")}
              </Button>
            </TableHead>
            <TableHead className="w-5/12">
              <Button
                variant="ghost"
                onClick={() => handleSort("name")}
                className="flex h-8 items-center gap-1"
              >
                Name {fixedCourses.length > 0 && getSortIcon("name")}
              </Button>
            </TableHead>
            <TableHead className="w-1/12 text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("useful")}
                className="ml-auto flex h-8 items-center gap-1"
              >
                Useful {fixedCourses.length > 0 && getSortIcon("useful")}
              </Button>
            </TableHead>
            <TableHead className="w-1/12 text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("liked")}
                className="ml-auto flex h-8 items-center gap-1"
              >
                Liked {fixedCourses.length > 0 && getSortIcon("liked")}
              </Button>
            </TableHead>
            <TableHead className="w-1/12 text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("easy")}
                className="ml-auto flex h-8 items-center gap-1"
              >
                Easy {fixedCourses.length > 0 && getSortIcon("easy")}
              </Button>
            </TableHead>
            <TableHead className="w-1/12 text-right">
              <Button
                variant="ghost"
                onClick={() => handleSort("numRatings")}
                className="ml-auto flex h-8 items-center gap-1"
              >
                # Ratings {fixedCourses.length > 0 && getSortIcon("numRatings")}
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedFixedCourses.map(({ courseItemId, course }) => (
            <TableRow key={courseItemId}>
              <TableCell>
                <Button
                  variant="destructive"
                  onClick={async () => {
                    try {
                      startTransition(() => {
                        removeOptimisticFixedCourse(course.id);
                      });
                      await removeCourseSelectionAction(course.id);
                      toast.success("Course removed successfully");
                    } catch (error) {
                      console.error(error);
                      toast.error("Failed to remove course");
                    }
                  }}
                >
                  Remove
                </Button>
              </TableCell>
              <TableCell>
                <CourseHoverLink course={course} />
              </TableCell>
              <TableCell className="px-6">{course.name}</TableCell>
              <TableCell className="px-6 text-right">
                {formatRating(course.usefulRating)}
              </TableCell>
              <TableCell className="px-6 text-right">
                {formatRating(course.likedRating)}
              </TableCell>
              <TableCell className="px-6 text-right">
                {formatRating(course.easyRating)}
              </TableCell>
              <TableCell className="px-6 text-right">
                {course.numRatings ?? "N/A"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
