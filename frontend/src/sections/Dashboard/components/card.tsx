import classNames from "classnames";
import { ReactNode } from "react";
import './inforcard.css';
import { useNavigate } from "react-router-dom";
import { Downicon, Upicon } from "./icons";
import { ChartCustom,HorizontalBarChart } from "./chart";
import { TableCustom } from "../../../components";

export const WrapperCard = ({ children, type = "card" }: { children: ReactNode | string, type?: "map" | "card" }) => {
    return (
      <div className={classNames("border border-solid border-[#DFE3E8] rounded-2xl overflow-hidden", type == "card" && "p-4")} style={{ backgroundColor: '#FBFBFB', height: '100%',width:'100%' }}>
        {children}
      </div>
    );
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
    <span className="text-[20px]  flex items-center justify-center p-1" style={{ fontWeight: 'bold' }}>{data.data}</span>
    {data.show_ratio && (
        <span className="text-[14px] flex items-center justify-center py-2" style={{ marginTop: '5px' }}> 
            <span className="text-[16px]" style={{ color: data.ratio >= 50 ? '#01B3A3' : 'rgba(255, 86, 48, 1)', marginRight: '5px', fontWeight: "bold" }}>{data.ratio}%</span>
            <span className="text-[#637381]"> trên tổng số báo cáo</span>
        </span>
    )}
</div>

    </WrapperCard>
}
export const InfoCard =({data}: {data:any}) => {
   // Kiểm tra số lượng bản ghi
   let shouldDisplayPagination = false;
   let shouldDisplayScroll = false
   if(data.data.source){
    shouldDisplayPagination = data.data.source.length > 5;
    shouldDisplayScroll = data.data.source.length > 5;
   }
  
 
  const navigate = useNavigate();
  const handleRowClick = (record: any) => {
    // Xử lý sự kiện click vào từng hàng ở đây
    localStorage.setItem('campaign_dashboard', JSON.stringify(record));
    navigate(`/reports`);
};
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
           <TableCustom style={{height:'100%'}}
             pagination={shouldDisplayPagination}
             scroll={shouldDisplayScroll ? { y: 270 } : {}}
            rowClassName="row-pointer"
            columns={data.data.columns}
            dataSource={data.data.source}
            onRow={(record: any) => ({
              onClick: () => handleRowClick(record)
          })}
          />
    </WrapperCardTable>
}
export const InfoCardEmploy =({data}: {data:any}) => {
   // Kiểm tra số lượng bản ghi
   let shouldDisplayPagination = false;
   let shouldDisplayScroll = false
  if(data.data.source){
    shouldDisplayPagination = data.data.source.length > 5;
    shouldDisplayScroll = data.data.source.length > 5;
   }
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
           <TableCustom style={{height:'100%'}}  pagination={shouldDisplayPagination}
             scroll={shouldDisplayScroll ? { y: 270 } : {}} size="small"
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