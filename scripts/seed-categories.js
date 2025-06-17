const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// List of educational categories for an LMS system
const categories = [
  // Technology & Computer Science
  { name: "Web Development" },
  { name: "Mobile App Development" },
  { name: "Data Science" },
  { name: "Machine Learning" },
  { name: "Artificial Intelligence" },
  { name: "Cloud Computing" },
  { name: "DevOps" },
  { name: "Cybersecurity" },
  { name: "Blockchain Technology" },
  
  // Business
  { name: "Digital Marketing" },
  { name: "Entrepreneurship" },
  { name: "Business Analytics" },
  { name: "Project Management" },
  { name: "Finance" },
  { name: "Human Resources" },
  
  // Arts & Design
  { name: "Graphic Design" },
  { name: "UI/UX Design" },
  { name: "Photography" },
  { name: "Video Production" },
  { name: "Animation" },
  
  // Personal Development
  { name: "Leadership" },
  { name: "Public Speaking" },
  { name: "Time Management" },
  { name: "Critical Thinking" },
  
  // Languages
  { name: "English" },
  { name: "Spanish" },
  { name: "French" },
  { name: "German" },
  { name: "Mandarin" },
  { name: "Japanese" }
];

async function main() {
  console.log(`Start seeding categories...`);
  
  // Delete all existing categories first (optional - remove if you don't want to clear existing data)
  // await prisma.category.deleteMany({});
  // console.log('Deleted existing categories');
  
  // Insert categories
  for (const category of categories) {
    try {
      const createdCategory = await prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: category
      });
      console.log(`Created category: ${createdCategory.name} (ID: ${createdCategory.id})`);
    } catch (error) {
      console.error(`Failed to create category: ${category.name}`, error);
    }
  }
  
  console.log(`Seeding finished.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // Close the database connection when done
    await prisma.$disconnect();
  });
