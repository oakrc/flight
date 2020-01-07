import React from 'react'
import '../../css/components/BookAndLanding/CloudandCard.scss';
import cloud from '../../css/images/cloud1.png';
import cloud2 from '../../css/images/cloud2.png';
import cloud3 from '../../css/images/cloud3.png';
import cloud4 from '../../css/images/cloud4.png';
import cloud5 from '../../css/images/cloud5.png';
import cloud6 from '../../css/images/cloud6.png';

function CloudandCard(props) {
    let random;
    let cloudType = cloud;

    switch(props.src) {
        case 2: 
            cloudType = cloud2;
            random = ((0.5 - Math.random()) * 12);
            break;
        case 3:
            cloudType = cloud3;
            random = ((0.5 - Math.random()) * 12);
            break; 
        case 4:
            cloudType = cloud4;
            random = ((0.5 - Math.random()) * 12);
            break; 
        case 5:
            cloudType = cloud5;
            random = ((0.5 - Math.random()) * 12);
            break;
        case 6:
            cloudType = cloud6;
            random = ((0.5 - Math.random()) * 12);
            break;
        default: 
            cloudType = cloud;
            break;
    }

    return (
        <div>
            <div style={{left: `${random}vw`}} className={`cardContainer ${props.src % 2 === 1 ? 'card-left' : 'card-right'} ${props.src === 1 ? 'firstCard' : 'followingCard'}`}>
                <img className="cloud" alt='' src={cloudType}></img>
            </div>
        </div>
    )
}

export default CloudandCard
