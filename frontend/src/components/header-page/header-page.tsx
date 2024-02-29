import { Button, Row } from "antd";
import React from "react";

type button = {
  label: string;
  size?: string;
  icon?: React.ReactNode;
  action?: any;
  type?: string;
  className?: string;
  [key:string]: any;
};

type Props = {
  title: string;
  buttons?: button[];
  icon?: React.ReactNode
};

export function HeaderPage({ title, buttons, icon }: Props) {
  return (
    <>
      <Row className="flex flex-wrap justify-between items-center px-0 py-5">
        <div className="flex justify-center items-center">
          {icon}
          <span className="text-2xl font-semibold leading-[21px]">{title}</span>
        </div>
        <div className="flex mb-2">
        
          {buttons &&
            buttons.filter(button => button).map(({className,size,icon,action,type,label,...rest}:button) => {
              
              return (
                <Button
                  className={className}
                  size={size || "middle"}
                  icon={icon}
                  onClick={action}
                  type={type}
                   {...rest}
                >
                  {label}
                </Button>
              )
            })}
        </div>
      </Row>
    </>
  );
}
