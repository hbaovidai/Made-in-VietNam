import React from "react";

export interface CompConf<P = any> {
  id?: string;
  props?: P;
  Comp: React.ComponentType;
}

export function fromConf<P>(
  {id, props, Comp}: CompConf<P>,
  runTimeProps?: Partial<P>,
): React.ReactNode {
  console.log(typeof props);
  return <Comp key={id} {...props} {...runTimeProps}/>;
}
