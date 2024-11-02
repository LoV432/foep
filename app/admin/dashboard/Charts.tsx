'use client';

import { Bar, BarChart, Line, LineChart, XAxis, YAxis } from 'recharts';
import { ResponsiveContainer } from 'recharts';
import { use } from 'react';

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent
} from '@/components/ui/chart';

export function DashboardLineChart({
	enrollmentData
}: {
	enrollmentData: any;
}) {
	return (
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
	);
}

export function DashboardBarChart({
	data,
	dataKeys
}: {
	data: any;
	dataKeys: {
		y: string;
		x: string;
	};
}) {
	return (
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
				<BarChart data={use(data)}>
					<XAxis dataKey={dataKeys.x} />
					<YAxis />
					<ChartTooltip content={<ChartTooltipContent />} />
					<Bar dataKey={dataKeys.y} fill="var(--color-courses)" />
				</BarChart>
			</ResponsiveContainer>
		</ChartContainer>
	);
}
