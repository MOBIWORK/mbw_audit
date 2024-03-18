import classNames from "classnames";
import { ReactNode } from "react";
import { Downicon, Upicon } from "./icons";
import { ChartCustom,HorizontalBarChart } from "./chart";
import { TableCustom } from "../../../components";

export const WrapperCard = ({children,type="card"}: {children: ReactNode | string,type?: "map" | "card"}) => {
    return <div className={classNames("border border-solid border-[#DFE3E8] rounded-2xl overflow-hidden ",type=="card" && "p-4")}>
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
        <div className="text-center" style={{ marginBottom: '10px' }}>
        <span style={{ fontWeight: 'bold' }}>{data.title}</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '24px', fontWeight: 'bold' }}>{data.data}</span>
        {data.show_ratio && ( // Kiểm tra và hiển thị data.value nếu showValue là true
        <span style={{ marginTop: '5px', fontSize: '16px' }}>
            {data.ratio} %
        </span>
        )}
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
export const InfoCardEmploy =({data}: {data:any}) => {
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
           <TableCustom pagination={{ pageSize: 5 }} scroll={{ y: 450 }} size="small"
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
            <HorizontalBarChart data={data.data}/>
            
    </WrapperCard2>
}