import { getUserSession } from "@/lib/session";
import Link from "next/link";

export default async function Home() {
  const session = await getUserSession();
  return (
    <div>
      <div className="min-h-[calc(100vh-124px)] flex justify-center items-center text-slate-900 ">
        <div className="flex bg-white px-6 py-8 rounded-lg shadow-md mx-4 opacity-85">
          <div className="flex flex-col gap-6 md:gap-10">
            <h1 className="text-2xl lg:text-3xl font-extrabold px-6 py-4 ">
              AI Generate Quizes in Minutes!
            </h1>
            <div className="flex justify-center">
              <p className="lg:text-xl lg:max-w-96 text-stone-600 max-w-64">
                Quiz Portal makes it simple for teachers and employers to
                administer, create, and manage quizzes, streamlining assessments
                and tracking results with ease.
              </p>
              <p></p>
            </div>
            <div className="flex justify-center">
              <div className="flex flex-col lg:flex-row items-start px-6 lg:gap-6 gap-4 lg:py-6 ">
                <Link
                  className="btn-primary-lg"
                  href={`/quiz-dashboard/create-quiz/${session?.id}`}
                >
                  Create a Quiz
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
