import React from 'react'
import '../../css/components/BookAndLanding/CloudandCard.scss';
import cloud from '../../css/images/cloud1.png';
import cloud2 from '../../css/images/cloud2.png';
import cloud3 from '../../css/images/cloud3.png';
import cloud4 from '../../css/images/cloud4.png';
import cloud5 from '../../css/images/cloud5.png';
import cloud6 from '../../css/images/cloud6.png';

function CloudandCard(props) {
    let cloudType = cloud;

    switch(props.src) {
        case 2: 
            cloudType = cloud2;
            break;
        case 3:
            cloudType = cloud3;
            break; 
        case 4:
            cloudType = cloud4;
            break; 
        case 5: 
            cloudType = cloud5;
            break;
        case 6:
            cloudType = cloud6;
            break;
        default: 
            cloudType = cloud;
            break;
    }

    return (
        <div>
            <div style={{left: `${props.left}vw`}} className={`cardContainer ${props.src % 2 === 1 ? 'card-left' : 'card-right'} ${props.src === 1 ? 'firstCard' : 'followingCard'}`}>
                <img className="cloud" alt='' src={cloudType}></img>
            </div>
        </div>
    )
}

export default CloudandCard
