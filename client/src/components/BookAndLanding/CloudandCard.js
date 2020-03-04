import React from 'react';

import airplane from '../../css/images/airplane.jpg';
import hawaii from '../../css/images/hawaii.jpg';
import saltlake from '../../css/images/saltlake.jpg';
import losAngeles from '../../css/images/losangeles.jpg';
import sanfran from '../../css/images/sanfran.jpg';
import seattle from '../../css/images/seattle.jpg';
import '../../css/components/BookAndLanding/CloudandCard.scss';

function CloudandCard(props) {
    return (
        <div className="Clouds">
            <div className="cloudpic">
                <img alt="airplane" src={airplane} />
                <div className="cloud">
                    <h1>About West Flight</h1>
                    <hr></hr>
                    <div className="pboy">
                        Headquartered in Southern California, WestFlight Airlines is an affordable airline perfectly suited for people traveling around California and its surrounding states. We service a wide range of cities on the west coast, stretching from Los Angeles to Seattle. Our commitment to you is supported by a large team of aviation professionals, flight attendants, and ticket agents who work hard to run all of our processes smoothly.
                        <br></br>
                        <br></br>
                        Our company is committed to delivering you the best in-flight experience for a low cost.<br></br>
                        However, why do place such a large emphasis on low fares?<br></br>
                        We keep these important principles in mind:<br></br>
                        <ul>
                            <li>Travel should be accessible to everyone.</li>
                            <li>People should travel more often and explore new places.</li>
                            <li>People’s needs should not be hindered by expensive transportation.</li>
                        </ul>
                        We hope to see you flying with us soon!
                    </div>
                </div>
            </div>
            <div className="cloudpic">
                <img alt="Hawaii" src={hawaii} />
                <div className="cloud">
                    <h1>Vacation Spot - Hawaii</h1>
                    <hr></hr>
                    <div className="pboy">
                    From volcanic landscapes to hidden waterfalls… active adventures to an energetic nightlife… a holiday on the Hawaiian Islands offers infinite experiences in one destination. Each of the six major islands – Kauai, Oahu, Molokai, Lanai, Maui, and the island of Hawaii – has its own distinct personality, but no matter which ones you choose, you’ll discover endless opportunities for adventure, dining, culture and relaxation. Popular tourist attractions include the Volcanoes National Park, the Polynesian Cultural Center, as well as the beautiful beaches surrounding the island.
<br></br>Come journey through the islands and explore the rich culture of Hawaii!
                    </div>
                </div>
            </div>
            <div className="cloudpic">
                <img alt="Salt Lake City" src={saltlake} />
                <div className="cloud">
                    <h1>Vacation Spot - Salt Lake City</h1>
                    <hr></hr>
                    <div className="pboy">
                    Whether you're visiting Salt Lake for business or pleasure, you're in for a great time. Salt Lake City is the capital and most populous municipality of the U.S. state of Utah, and it is filled with lots of activities and fun. Popular tourist attractions include visiting the Utah Olympic Park, which was built for the 2002 Olympic Winter games and offers a multitude of summer/winter activities year round. Another great place to visit is the Great Salt Lake Marina, where you can do things like kayaking, paddle boarding, and pedal boating. Overall, Salt Lake City contains many new adventures that you should consider trying out. 
<br></br>Come and explore the city by booking a flight!
                    </div>
                </div>
            </div>
            <div className="cloudpic">
                <img alt="Los Angeles Beach" src={losAngeles} />
                <div className="cloud">
                    <h1>Vacation Spot - Los Angeles</h1>
                    <hr></hr>
                    <div className="pboy">
                    The City of Los Angeles holds many distinctions. From the city’s Mediterranean climate, entertainment industry, ethnic diversity, and its sprawling metropolis, L.A is a wonderful place to explore. Los Angeles is also known for Hollywood, which is the entertainment capital of the world, as well as being home to more than 100 museums. Furthermore, amusement parks around the city, such as Disneyland, Knotts Berry Farm, and Six Flags, add a thrilling experience to your trip. L.A.’s coastal regions boast some of the best surf spots, amazing oceanfront dining and trendy shops. Each seaside town is unique, offering distinctive landmarks such as Santa Monica’s famous pier.
                    <br></br><br></br>
                    Interested in exploring Los Angeles?
                    Book a flight now!
                    </div>
                </div>
            </div>
            <div className="cloudpic">
                <img alt="San Francisco - Golden Gate Bridge" src={sanfran} />
                <div className="cloud">
                    <h1>Vacation Spot - San Francisco</h1>
                    <hr></hr>
                    <div className="pboy">
                    Pack your bags and explore San Francisco!<br></br>
                    San Francisco is home to a little bit of everything. Whether you're a first time visitor or a long-time local, San Francisco's Golden Gates welcome all. From the city’s beautiful scenery of the famous Golden Gate Bridge, to the piers, wharves, and delicious seafood, this city is home to everyone. Popular tourist attractions include Alcatraz Island, a wide range of art/history museums, and Lombard Street, which is the world’s most crooked street. Surrounding San Francisco is the big tech giants of Silicon Valley. Overall, San Francisco is a lively city with many things to do.
                    <br></br><br></br>
                    Plan your journey and book a flight now!
                    </div>
                </div>
            </div>
            <div className="cloudpic">
                <img alt="Seattle" src={seattle} />
                <div className="cloud">
                    <h1>Vacation Spot - Seattle</h1>
                    <hr></hr>
                    <div className="pboy">
                    Seattle, a city on Puget Sound in the Pacific Northwest, is surrounded by water, mountains and evergreen forests, and contains thousands of acres of parkland. Washington State’s largest city, it’s home to a large tech industry, with Microsoft and Amazon headquartered in its metropolitan area. The futuristic Space Needle, a 1962 World’s Fair legacy, is its most iconic landmark. 
                    <br></br>Popular tourist attractions include:
                    <ul>
                        <li>Pike Place Market, with its iconic market sign and the gum wall</li>
                        <li>Seattle Art Museum, which is the city’s largest museum</li>
                        <li>Central Public Library, which has an architecturally distinct design</li>
                    </ul>
                    <br></br><br></br>
                    Interested in this travel destination? Book a flight now!
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CloudandCard
