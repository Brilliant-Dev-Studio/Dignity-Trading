export const TESTIMONIALS = [
  {
    src: "/testimonial_five.jpg",
    alt: "Student testimonial: Knowledgeable and Kind",
    label: "Knowledgeable and Kind",
  },
  {
    src: "/testimonial_four.jpg",
    alt: "Student testimonial: Effective and Practical",
    label: "Effective and Practical",
  },
  {
    src: "/testimonial_one.jpg",
    alt: "Student testimonial: Beginner Friendly",
    label: "Beginner Friendly",
  },
  {
    src: "/testimonial_three.jpg",
    alt: "Student testimonial: Experienced Marketer",
    label: "Experienced Marketer",
  },
  {
    src: "/testimonial_two.jpg",
    alt: "Student testimonial: Patient and open to discuss",
    label: "Patient and open to Discuss",
  },
] as const;

export type TestimonialItem = (typeof TESTIMONIALS)[number];
