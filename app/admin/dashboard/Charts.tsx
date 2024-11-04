'use client';

import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from 'recharts';
import { ResponsiveContainer } from 'recharts';
import { use } from 'react';
import type { EnrollmentData, TopCategoriesData, TopCoursesData } from './page';
import { CSVLink } from 'react-csv';

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent
} from '@/components/ui/chart';
import {
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { Download } from 'lucide-react';

export function DashboardLineChart({
	enrollmentData
}: {
	enrollmentData: EnrollmentData;
}) {
	const csvData = use(enrollmentData).map((row) => Object.values(row));
	return (
		<>
			<CardHeader>
				<CardTitle>
					Course Enrollments{' '}
					<CSVLink
						className="inline-block underline"
						data={csvData}
						filename={`enrollments.csv`}
					>
						<Download className="h-4 w-4 text-muted-foreground" />
					</CSVLink>
				</CardTitle>
			</CardHeader>
			<CardContent className="overflow-scroll pl-2">
				<ChartContainer
					config={{
						enrollments: {
							label: 'Enrollments',
							color: 'hsl(var(--chart-2))'
						}
					}}
					className="h-[300px] w-full"
				>
					<ResponsiveContainer width="100%" height="100%">
						<LineChart data={use(enrollmentData)}>
							<XAxis dataKey="month" />
							<YAxis />
							<ChartTooltip content={<ChartTooltipContent />} />
							<Line
								type="monotone"
								dataKey="enrollments"
								stroke="var(--color-enrollments)"
								strokeWidth={2}
							/>
						</LineChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</>
	);
}

export function DashboardBarChart({
	data,
	dataKeys,
	title,
	description
}: {
	data: TopCategoriesData | TopCoursesData;
	dataKeys: {
		y: string;
		x: string;
	};
	title: string;
	description: string;
}) {
	const csvData = use(data as TopCategoriesData).map((row) =>
		Object.values(row)
	);
	return (
		<>
			<CardHeader>
				<CardTitle>
					{title}{' '}
					<CSVLink
						className="inline-block underline"
						data={csvData}
						filename={`${title}.csv`}
					>
						<Download className="h-4 w-4 text-muted-foreground" />
					</CSVLink>
				</CardTitle>
				<CardDescription>{description}</CardDescription>
			</CardHeader>
			<CardContent className="overflow-scroll pl-2">
				<ChartContainer
					config={{
						courses: {
							label: 'Courses',
							color: 'hsl(var(--chart-2))'
						}
					}}
					className="h-[300px]"
				>
					<ResponsiveContainer width="100%" height="100%">
						<BarChart data={use(data as TopCategoriesData)}>
							<XAxis dataKey={dataKeys.x} />
							<YAxis />
							<ChartTooltip content={<ChartTooltipContent />} />
							<Bar dataKey={dataKeys.y} fill="var(--color-courses)" />
						</BarChart>
					</ResponsiveContainer>
				</ChartContainer>
			</CardContent>
		</>
	);
}
