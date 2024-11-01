'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle2, XCircle } from 'lucide-react';
import Link from 'next/link';
import NextChapterButton from '../../NextChapterButton';

export default function Quiz({
	data,
	navigation
}: {
	data: {
		chapterInfo: {
			title: string;
			estimated_time: number;
			course_id: number;
			order: number;
		};
		questions: {
			question: string;
			options: {
				id: number;
				text: string;
			}[];
			correct_option_id: number;
			order: number;
		}[];
	};
	navigation: {
		slug: string;
		previous: {
			title: string;
			estimated_time: number;
			type: 'article' | 'quiz';
			course_chapter_id: number;
		};
		next: {
			title: string;
			estimated_time: number;
			type: 'article' | 'quiz';
			course_chapter_id: number;
		};
	};
}) {
	const questions = data.questions.sort((a, b) => a.order - b.order);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [userAnswers, setUserAnswers] = useState<(number | null)[]>(
		new Array(questions.length).fill(null)
	);
	const [quizSubmitted, setQuizSubmitted] = useState(false);
	const [score, setScore] = useState(0);

	function handleOptionSelect(optionId: number) {
		if (!quizSubmitted) {
			const newAnswers = [...userAnswers];
			newAnswers[currentQuestionIndex] = optionId;
			setUserAnswers(newAnswers);
		}
	}

	function handleNext() {
		if (currentQuestionIndex < questions.length - 1) {
			setCurrentQuestionIndex(currentQuestionIndex + 1);
		}
	}

	function handlePrevious() {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex(currentQuestionIndex - 1);
		}
	}

	function handleSubmit() {
		setQuizSubmitted(true);
		const totalScore = questions.reduce((acc, question, index) => {
			return acc + (userAnswers[index] === question.correct_option_id ? 1 : 0);
		}, 0);
		setScore(totalScore);
	}

	function handleRestart() {
		setQuizSubmitted(false);
		setUserAnswers(new Array(questions.length).fill(null));
		setCurrentQuestionIndex(0);
	}

	const currentQuestion = questions[currentQuestionIndex];

	return (
		<>
			<Card className="mx-auto w-full max-w-2xl">
				<CardHeader>
					<CardTitle>{data.chapterInfo.title}</CardTitle>
					<CardDescription>
						{quizSubmitted
							? `Your Score: ${score} out of ${questions.length}`
							: `Question ${currentQuestionIndex + 1} of ${questions.length}`}
					</CardDescription>
				</CardHeader>
				<CardContent>
					{!quizSubmitted ? (
						<>
							<h2 className="mb-4 text-xl font-semibold">
								{currentQuestion.question}
							</h2>
							<RadioGroup
								value={userAnswers[currentQuestionIndex]?.toString() || ''}
								onValueChange={(value) => handleOptionSelect(parseInt(value))}
							>
								{currentQuestion.options.map((option) => (
									<div
										key={option.id}
										className="mb-2 flex items-center space-x-2"
									>
										<RadioGroupItem
											value={option.id.toString()}
											id={`option-${option.id}`}
										/>
										<Label htmlFor={`option-${option.id}`}>{option.text}</Label>
									</div>
								))}
							</RadioGroup>
						</>
					) : (
						<ScrollArea className="h-[300px] pr-4">
							{questions.map((question, index) => (
								<div key={index} className="mb-4">
									<h3 className="font-semibold">
										{index + 1}. {question.question}
									</h3>
									<p className="mt-2">
										Your answer:{' '}
										{
											question.options.find(
												(opt) => opt.id === userAnswers[index]
											)?.text
										}
									</p>
									{userAnswers[index] !== question.correct_option_id && (
										<p className="mt-1 flex items-center text-red-600">
											<XCircle className="mr-1 h-4 w-4" />
											Correct answer:{' '}
											{
												question.options.find(
													(opt) => opt.id === question.correct_option_id
												)?.text
											}
										</p>
									)}
									{userAnswers[index] === question.correct_option_id && (
										<p className="mt-1 flex items-center text-green-600">
											<CheckCircle2 className="mr-1 h-4 w-4" />
											Correct!
										</p>
									)}
								</div>
							))}
						</ScrollArea>
					)}
				</CardContent>
				<CardFooter className="flex justify-between">
					{!quizSubmitted ? (
						<>
							<Button
								onClick={handlePrevious}
								disabled={currentQuestionIndex === 0}
							>
								Previous
							</Button>
							{currentQuestionIndex === questions.length - 1 ? (
								<Button
									onClick={handleSubmit}
									disabled={userAnswers.some((answer) => answer === null)}
								>
									Submit Quiz
								</Button>
							) : (
								<Button onClick={handleNext}>Next</Button>
							)}
						</>
					) : (
						<Button onClick={handleRestart} className="w-full">
							Restart Quiz
						</Button>
					)}
				</CardFooter>
			</Card>
			{quizSubmitted && (
				<div className="mx-auto mt-4 flex w-full max-w-2xl justify-between">
					{navigation.previous && (
						<Button asChild variant="outline">
							<Link
								href={`/course/${navigation.slug}/chapter/${navigation.previous.course_chapter_id}/${navigation.previous.type}`}
							>
								← {navigation.previous.title} (
								{navigation.previous.estimated_time} min,
								{navigation.previous.type})
							</Link>
						</Button>
					)}
					{navigation.next && (
						<NextChapterButton
							courseId={data.chapterInfo.course_id}
							redirectUrl={`/course/${navigation.slug}/chapter/${navigation.next.course_chapter_id}/${navigation.next.type}`}
							buttonText={`${navigation.next.title} (${navigation.next.estimated_time} min, ${navigation.next.type}) →`}
							currentChapterOrder={data.chapterInfo.order}
						/>
					)}
				</div>
			)}
		</>
	);
}
