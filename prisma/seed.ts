import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    const testimonials = [
        {
            name: 'Sarah Johnson',
            testimonial: 'The team at YourDealership made the entire car buying process a breeze. They were transparent, friendly, and incredibly knowledgeable. I found the perfect car for my family!',
            rating: 5,
        },
        {
            name: 'Michael Chen',
            testimonial: 'I was impressed with the curated selection of high-quality vehicles. No pressure, just great service. I\'ll definitely be back for my next purchase.',
            rating: 5,
        },
        {
            name: 'Emily Rodriguez',
            testimonial: 'As a first-time car buyer, I was nervous, but the staff guided me through every step. The financing options were flexible and easy to understand. Highly recommended!',
            rating: 5,
        },
        {
            name: 'David Lee',
            testimonial: 'Found a rare model I had been searching for months. The car was in pristine condition, exactly as described online. A trustworthy dealership that values quality.',
            rating: 4,
        },
        {
            name: 'Jessica Williams',
            testimonial: 'The after-sales service is just as good as their sales process. Had a minor issue a week after purchase, and they resolved it quickly and without any hassle.',
            rating: 5,
        },
        {
            name: 'Chris Martinez',
            testimonial: 'Great atmosphere and a fantastic team. They listened to what I needed and didn\'t try to upsell me on features I didn\'t want. A very positive experience.',
            rating: 5,
        },
        {
            name: 'Amanda Brown',
            testimonial: 'The virtual showroom and detailed online listings were a huge help. I knew exactly what to expect when I came in for the test drive. Very efficient!',
            rating: 4,
        },
        {
            name: 'Kevin Garcia',
            testimonial: 'Their trade-in offer was fair and competitive. The entire transaction, from trade-in to driving away in my new car, was seamless. Thank you!',
            rating: 5,
        },
        {
            name: 'Laura Davis',
            testimonial: 'I appreciated the calm, professional environment. It\'s a refreshing change from the high-pressure tactics you find at other dealerships.',
            rating: 5,
        },
        {
            name: 'James Wilson',
            testimonial: 'An excellent selection of both new and pre-owned cars. The staff\'s passion for automobiles is evident. A great place for any car enthusiast.',
            rating: 5,
        },
    ];

    for (const t of testimonials) {
        await prisma.testimonial.create({
            data: t,
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
