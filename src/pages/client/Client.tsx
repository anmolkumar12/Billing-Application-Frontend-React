import React, { useEffect, useState } from 'react';
import { TabView, TabPanel } from "primereact/tabview";
import { Loader } from "../../components/ui/loader/Loader";
import { Tooltip } from "primereact/tooltip";
import classes from "./Client.module.scss";
import ClientMaster from './ClientMaster';
import ClientContactMaster from './ClientContactMaster';
import ClientBillToMaster from './ClientBillToMaster';
import ClientShipToMaster from './ClientShipToMaster';
import ClientGroupMaster from './ClientGroupMaster';

function Client() {

  const [activeIndex, setActiveIndex] = useState(0);
  const [loader, setLoader] = useState(false);

  const onTabChange = (e: any) => {
    setActiveIndex(e.index);
  };

    useEffect(() => { }, [activeIndex]);

  return loader ? (
    <Loader />
  ) : (
    <>
      <TabView
        activeIndex={activeIndex}
        onTabChange={onTabChange}
        className={classes["main-tab-screen"]}
        panelContainerClassName={classes["panel-tabs"]}
      >
        <TabPanel header="Client">
          <ClientMaster />
        </TabPanel>
        <TabPanel header="Client Contact">
          <ClientContactMaster />
        </TabPanel>
        <TabPanel header="Client Group">
          <ClientGroupMaster />
        </TabPanel>
        <TabPanel header="Client Bill To">
          <ClientBillToMaster />
        </TabPanel>
        <TabPanel header="Client Ship To">
          <ClientShipToMaster />
        </TabPanel>
      </TabView>
    </>
  );
}

export default Client
