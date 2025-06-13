import Link from "next/link";

export default function Home() {
  return (
    <div className="absolute top-0 left-0 w-[100vw] h-[100vh] flex justify-around items-center">
      <div className="flex flex-col justify-around gap-5">
        <h1 className="text-4xl text-center">{"It's just a demo API"}</h1>
        <p className="text-lg text-center">
          You can find more information at the client side of application{" "}
        </p>
        <div className="flex justify-center">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            className="border-2 p-2 rounded-2xl w-[200px] text-center uppercase transition-all duration-300 hover:bg-foreground hover:text-background"
            href={"https://rourory.github.io/telephony-demo"}
          >
            Go to the client
          </Link>
        </div>
      </div>
    </div>
  );
}
