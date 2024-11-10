const BillingEventCard = ({event}) => {
    return ( <div className="w-full">
        <div className="flex gap-x-3">
            <img className="max-w-[160px] max-h-[336px]" src={event["Image"]}/>
            <div className="flex flex-col justify-around">
                <h4 className="text-[26px] font-semibold uppercase">{event["EventName"]}</h4>
                <div className="text-[18px]">
                    <div>Venue : <span>{event["Venue"]}</span></div>
                    <div>Date : <span>{event["Date"]}</span></div>
                    <div>Artist : <span>{event["Artist"]}</span></div>
                    <div>Ticket Price : <span className="uppercase">{event["Price"]} eth</span></div>
                </div>
            </div>
        </div>
    </div> );
}
 
export default BillingEventCard;