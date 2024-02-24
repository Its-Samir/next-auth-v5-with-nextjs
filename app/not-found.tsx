import { Card } from '@/components/ui/card';

export default function NotFoundPage() {
    return (
        <Card className='w-full h-[100vh] flex flex-col items-center justify-center'>
            <h1 className="text-[6rem] text-slate-700 -my-[1rem]">404</h1>
            <p className="text-slate-500 text-xl -my-[1rem] bg-white uppercase">Page not found</p>
        </Card>
    )
}
