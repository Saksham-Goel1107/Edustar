const { PrismaClient } = require('@prisma/client');

const database = new PrismaClient();

// Questions with their corresponding answer options
const QUESTIONS_WITH_OPTIONS = [
	{
		question: 'What is the best way to learn programming, and you are not sure if you can do it?',
		options: [
			'Nothing is impossible, and I will do it right now and not later on in the future',
			'By doing it right now and not later on in the future',
			'They say that programming is hard, and I will do it right now and not later on in the future',
			'Say no more fam I got you fam'
		],
		correctAnswer: 'bcd' // This maps to options b, c, and d
	},
	{
		question: 'Which of the following is not a programming language, and why, and what is the best way to learn it?',
		options: [
			'By doing it right now and not later on in the future',
			'They say that programming is hard, and I will do it right now and not later on in the future',
			'They say that programming is hard, and I will do it right now and not later on in the future',
			'Somehow not possible'
		],
		correctAnswer: 'bcd' // This maps to options b, c, and d
	},
	{
		question: 'Why do you want to learn programming, and what do you want to do with it?',
		options: [
			'The best way to learn programming is to do it right now and not later on in the future',
			'I am not sure if I can do it, but I will try',
			'Nothing is impossible, and I will do it right now and not later on in the future',
			'They say that programming is hard, and I will do it right now and not later on in the future'
		],
		correctAnswer: 'acd' // This maps to options a, c, and d
	},
	{
		question: 'What do you think is the best way to learn programming, and you are not sure if you can do it, it is easy for me to learn?',
		options: [
			'Programming is hard, and I will do it right now and not later on in the future',
			'Programming is hard, and I will do it right now and not later on in the future',
			'Somehow, It is easy for me to learn',
			'Nothing is impossible, and I will do it right now and not later on in the future'
		],
		correctAnswer: 'ad' // This maps to options a and d
	},
	{
		question: 'Why do they say that programming is hard, and what is the best way to learn it, what do you think about it, and you will be able to do it?',
		options: [
			'Programming is hard, and I will do it right now and not later on in the future',
			'Programming is hard, and I will do it right now and not later on in the future',
			'They say that programming is hard, and I will do it right now and not later on in the future',
			'Programming is hard, and I will do it right now and not later on in the future'
		],
		correctAnswer: 'abcd' // This maps to all options
	},
];

const CORRECT_ANSWERS = [
	'a',
	'b',
	'c',
	'd',
	'ab',
	'ac',
	'ad',
	'bc',
	'bd',
	'cd',
	'abc',
	'abd',
	'acd',
	'bcd',
	'abcd',
];

async function main() {
	const seedingCategories = async () => {
		try {
			await database.category.createMany({
				data: [
					{ name: 'Computer Science' },
					{ name: 'Music' },
					{ name: 'Fitness' },
					{ name: 'Photography' },
					{ name: 'Accounting' },
					{ name: 'Engineering' },
					{ name: 'Filming' },
				],
			});

			console.log('Categories seeded successfully');
		} catch (error) {
			console.log('Error seeding the database categories: ', error);
		} finally {
			await database.$disconnect();
		}
	};

	const seedingQuestions = async () => {
		try {
			const courseIds = (
				await database.course.findMany({
					select: { id: true },
				})
			).map((course) => course.id);

			for (let i = 0; i < courseIds.length; i++) {
				const courseId = courseIds[i];

				const chapterIds = (
					await database.chapter.findMany({
						where: {
							courseId,
						},
						select: { id: true },
					})
				).map((chapter) => chapter.id);
				
				// Check if there are chapters for this course
				if (chapterIds.length === 0) {
					console.log(`Skipping questions for course ${courseId} - no chapters found`);
					continue;
				}

				const data = QUESTIONS_WITH_OPTIONS.map((questionObj) => {
					const chapterId =
						chapterIds[Math.floor(Math.random() * chapterIds.length)];

					return {
						courseId,
						chapterId, // Using a valid chapterId
						question: questionObj.question,
						correctAnswer: questionObj.correctAnswer,
					};
				});

				await database.question.createMany({ data });
			}

			console.log('Questions seeded successfully');
		} catch (error) {
			console.log('Error seeding the database questions: ', error);
		} finally {
			await database.$disconnect();
		}
	};

	const seedingAnswers = async () => {
		try {
			// Get all questions with their IDs and text
			const questions = await database.question.findMany({
				select: { 
					id: true,
					question: true 
				},
			});
			
			for (let question of questions) {
				// Find the corresponding question in our QUESTIONS_WITH_OPTIONS array
				const questionData = QUESTIONS_WITH_OPTIONS.find(q => q.question === question.question);
				
				if (questionData) {
					// Use the options from our QUESTIONS_WITH_OPTIONS array
					const data = questionData.options.map((label, index) => {
						const optionValues = ['a', 'b', 'c', 'd'];
						return {
							value: optionValues[index],
							label: label,
							questionId: question.id,
						};
					});
					
					await database.answer.createMany({ data });
				} else {
					// Fallback for any questions not found in our array
					const data = ['a', 'b', 'c', 'd'].map((value, index) => {
						return {
							value: value,
							label: `Option ${value.toUpperCase()} for question ${index + 1}`,
							questionId: question.id,
						};
					});
					
					await database.answer.createMany({ data });
				}
			}

			console.log('Answers seeded successfully');
		} catch (error) {
			console.log('Error seeding the database answers: ', error);
		} finally {
			await database.$disconnect();
		}
	};

	// Comment out categories seeding if they've already been created
	// seedingCategories();

	// First create questions
	await seedingQuestions();
	
	// Then create answers for those questions
	await seedingAnswers();
}

main();
