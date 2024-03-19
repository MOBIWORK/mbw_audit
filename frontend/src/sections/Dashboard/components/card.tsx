import classNames from "classnames";
import { ReactNode } from "react";
import { Downicon, Upicon } from "./icons";
import { ChartCustom,HorizontalBarChart } from "./chart";
import { TableCustom } from "../../../components";

export const WrapperCard = ({children,type="card"}: {children: ReactNode | string,type?: "map" | "card"}) => {
    return <div className={classNames("border border-solid border-[#DFE3E8] rounded-2xl overflow-hidden ",type=="card" && "p-4")} style={{backgroundColor:'#FBFBFB'}}>
    {children}
    </div>
}
export const WrapperCard2 = ({children,type="card"}: {children: ReactNode | string,type?: "map" | "card"}) => {
    return <div className={classNames("border border-solid border-[#DFE3E8] rounded-2xl overflow-hidden ",type=="card")}>
    {children}
    </div>
}
export const WrapperCardTable = ({children,type="card"}: {children: ReactNode | string,type?: "map" | "card"}) => {
    return <div className={classNames("border border-solid border-[#DFE3E8] rounded-2xl overflow-hidden h-[450px]",type=="card")}>
    {children}
    </div>
}

export const Overview =({data}: {data:any}) => {
    return <WrapperCard>
        <div className="text-center" style={{ marginBottom: '10px' }}>
        <span style={{ fontWeight: '400',fontSize:'1rem',lineHeight:'1.5rem' }}>{data.title}</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
    <span className="text-4xl font-medium flex items-center justify-center p-1">{data.data}</span>
    {data.show_ratio && (
        <span className="text-[14px] flex items-center justify-center py-2" style={{ marginTop: '5px' }}> 
            <span className="text-[16px]" style={{ color: data.ratio >= 50 ? '#01B3A3' : 'rgba(255, 86, 48, 1)', marginRight: '5px' }}>{data.ratio}%</span>
            <span className="text-[#637381]">tổng số báo cáo</span>
        </span>
    )}
</div>

    </WrapperCard>
}
export const InfoCard =({data}: {data:any}) => {
    return <WrapperCardTable >
          <p className="text-base font-medium pl-2" style={{
      fontSize: '15px',
      fontWeight: 600,
      lineHeight: '21px',
      letterSpacing: '0em',
      textAlign: 'left',color:'rgba(33, 43, 54, 1)',alignSelf:'center'
    }}>
            {data.title}
            </p>
           <TableCustom style={{height:'100%'}} scroll={{ y: 270 }}
            columns={data.data.columns}
            dataSource={data.data.source}
          />
    </WrapperCardTable>
}
export const InfoCardEmploy =({data}: {data:any}) => {
    return <WrapperCardTable>
        <div style={{height:'100%'}}>
        <p className="text-base font-medium pl-2" style={{
      fontSize: '15px',
      fontWeight: 600,
      lineHeight: '21px',
      letterSpacing: '0em',
      textAlign: 'left',color:'rgba(33, 43, 54, 1)',alignSelf:'center'
    }}>
            {data.title}
            </p>
           <TableCustom style={{height:'100%'}} pagination={{ pageSize: 5 }} scroll={{ y: 270 }} size="small"
            columns={data.data.columns}
            dataSource={data.data.source}
          />
        </div>
         
    </WrapperCardTable>
}
export const InfoCardChart =({data}: {data:any}) => {
    return <WrapperCardTable >
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
            
    </WrapperCardTable>
}