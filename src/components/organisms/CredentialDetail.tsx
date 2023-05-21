import { Box, Divider, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import moment from "moment";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

import { useStoredVCs } from "../../hooks/useStoredVCs";
import { decodeJWTToVCData } from "../../lib/utils";
import { CredentialCard } from "../molecules/CredentialCard";

export const CredentialDetail: React.FC = () => {
  const router = useRouter();
  const { vcID } = router.query;
  const { storedVCs } = useStoredVCs(vcID as string);

  const storedVC = React.useMemo(() => {
    return storedVCs[0];
  }, [storedVCs]);

  const decodedVC = React.useMemo(() => {
    if (storedVC) {
      return decodeJWTToVCData(storedVC.vc);
    }
  }, [storedVC]);

  return (
    <>
      {storedVC && (
        <Box p={4}>
          <Box marginBottom="3">
            <CredentialCard storedVC={storedVC}></CredentialCard>
          </Box>
          <Tabs size="md" variant="enclosed">
            <TabList>
              <Tab>Claim</Tab>
              <Tab>History</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                {Object.keys(storedVC.credentialSubject).map((key) => (
                  <Box key={key} marginBottom="3">
                    <CredentialSubjectItem index={key} credentialSubject={storedVC.credentialSubject} />
                  </Box>
                ))}
                <Divider marginBottom={"3"} />
                <Box marginBottom={"3"}>
                  <Text color="gray">Issuer</Text>
                  <Text fontSize="lg">{decodedVC.iss}</Text>
                </Box>
                <Box marginBottom={"3"}>
                  <Text color="gray">Issue date</Text>
                  <Text fontSize="lg">{moment.unix(decodedVC.iat).format("YYYY/MM/DD HH:mm")}</Text>
                </Box>
                <Box marginBottom={"3"}>
                  <Text color="gray">Expiry date</Text>
                  <Text fontSize="lg">{moment.unix(decodedVC.exp).format("YYYY/MM/DD HH:mm")}</Text>
                </Box>
              </TabPanel>
              <TabPanel>
                {storedVC.vcHistory ? (
                  storedVC.vcHistory.map((history) => (
                    <Box key={history.timestamp}>
                      <Text fontSize={"sm"}>{moment(history.timestamp).format("YYYY/MM/DD HH:mm")}</Text>
                      <Text>{history.message}</Text>
                    </Box>
                  ))
                ) : (
                  <Text>No history</Text>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      )}
    </>
  );
};

interface CredentialSubjectItemProps {
  index: string;
  credentialSubject: Record<string, string>;
}

const CredentialSubjectItem: React.FC<CredentialSubjectItemProps> = ({ index, credentialSubject }) => {
  // keyがphotoの場合は画像を表示する
  if (index === "photo") {
    return (
      <>
        <Text color="gray">{index}</Text>
        {Object.prototype.hasOwnProperty.call(credentialSubject, "photo") && (
          <Image alt="photo" src={"data:image/png;base64," + credentialSubject.photo} width={80} height={80} />
        )}
      </>
    );
  }
  // TODO: ここで日付のフォーマットを変換しているが、必要があれば入れる
  // if (index === "issued" || index === "expire") {
  //   return (
  //     <>
  //       <Text color="gray">{index}</Text>
  //       <Text fontSize="lg">{moment(credentialSubject[index]).format("YYYY/MM/DD HH:mm")}</Text>
  //     </>
  //   );
  // }
  return (
    <>
      <Text color="gray">{index}</Text>
      <Text fontSize="lg">{credentialSubject[index]}</Text>
    </>
  );
};
