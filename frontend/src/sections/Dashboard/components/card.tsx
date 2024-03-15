import classNames from "classnames";
import { ReactNode } from "react";
import { Downicon, Upicon } from "./icons";
import { ChartCustom,HorizontalBarChart } from "./chart";
import { TableCustom } from "../../../components";

export const WrapperCard = ({children,type="card"}: {children: ReactNode | string,type?: "map" | "card"}) => {
    return <div className={classNames("border border-solid border-[#DFE3E8] rounded-2xl overflow-hidden ",type=="card" && "p-6")}>
    {children}
    </div>
}
export const WrapperCard2 = ({children,type="card"}: {children: ReactNode | string,type?: "map" | "card"}) => {
    return <div className={classNames("border border-solid border-[#DFE3E8] rounded-2xl overflow-hidden ",type=="card")}>
    {children}
    </div>
}


export const Overview =({data}: {data:any}) => {
    return <WrapperCard>
       
         <div className="text-center" style={{display:'flex'}}>
         <ChartCustom data={data}/>
            <p className="text-base font-medium" style={{
      fontSize: '15px',
      fontWeight: 600,
      lineHeight: '21px',
      letterSpacing: '0em',
      textAlign: 'left',color:'rgba(33, 43, 54, 1)',alignSelf:'center'
    }}>
            {data.title}
            </p>
            
        </div>
    </WrapperCard>
}
export const InfoCard =({data}: {data:any}) => {
    return <WrapperCard2 >
          <p className="text-base font-medium pl-2" style={{
      fontSize: '15px',
      fontWeight: 600,
      lineHeight: '21px',
      letterSpacing: '0em',
      textAlign: 'left',color:'rgba(33, 43, 54, 1)',alignSelf:'center'
    }}>
            {data.title}
            </p>
           <TableCustom
            columns={data.data.columns}
            dataSource={data.data.source}
          />
    </WrapperCard2>
}
export const InfoCardChart =({data}: {data:any}) => {
    return <WrapperCard2 >
          <p className="text-base font-medium pl-2" style={{
      fontSize: '15px',
      fontWeight: 600,
      lineHeight: '21px',
      letterSpacing: '0em',
      textAlign: 'left',color:'rgba(33, 43, 54, 1)',alignSelf:'center'
    }}>
            {data.title}
            </p>
            <HorizontalBarChart data={data.chartData}/>
            
    </WrapperCard2>
}