import Link from 'next/link';


async function getData(){ //From Database eventually....
    const res = await fetch("http://snowtooth-api-rest.fly.dev");
    return res.json();
}

export default async function Page() {
  const item = await getData();

  return (
    <main>
        <div className="flex items-center space-x-4">
            <img src='/webstore-logo.png' 
                alt="Webstore Logo" 
                className = "h-140 w-150"
                ></img>
                
                <br></br>
            <div>
                <h1 className="text-center font-bold text-2xl">About Us</h1>
                <hr></hr>
                <br></br>
                    
                <p> Here at FreeStore we strive to provide excellant service by helping people find amazing
                    items for redicouly low prices. When Checking out you will realize we give all our customers
                    a 100 percent discount on their cart. Thats right 100 percent. We realize in todays market things are 
                    not longer as affordable as they once were, so we are here doing our best to help are customers and community thrive.
                </p>
                <br></br>

                <p> 
                    The idea for FreeStore began one late night when our founder, while browsing online for a reasonably 
                    priced waffle maker, realized that everything was way too expensive—and honestly, kind of boring. 
                    That’s when the lightbulb went off: what if there were a store that offered *everything*, charged 
                    *nothing*, and made online shopping fun again? With a dash of imagination, a sprinkle of internet 
                    magic, and absolutely no regard for profit, FreeStore was born. Since then, we’ve proudly committed 
                    ourselves to delivering top-tier fake products at unbeatable (literally zero) prices, just because we can.</p>

                    
            </div>
        </div>
        
        <br></br>
        <h1 className="text-center font-bold text-2xl">Contact Details</h1>
        <hr></hr>

        <p></p>
        <ul className="text-center">
          <li key={"Email_Link"}>
            <Link href={`/contact/email`}>
              Email: FreeStore@xyz.com
            </Link>
          </li>

          <li key={"Phone_Number"}>
            Phone Number: 919-818-717
          </li>

          <li key={"Address"}>
            Address: 400 Product Lane, College Station, TX, 77840
          </li>
      </ul>
    </main>
  );
}