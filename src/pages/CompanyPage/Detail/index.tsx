import { Button, Group, Paper, Stack, Title } from "@mantine/core";
import { useState } from "react";
import SimpleInfo from "./components/SimpleInfo";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import ContractInfo from "./components/ContractInfo";
import MachineInfo from "./components/MachineInfo";
import SupplyInfo from "./components/SupplyInfo";
import PesticideInfo from "./components/PesticideInfo";
import FertilizerInfo from "./components/FertilizeInfo";

export default function CompanyDetailPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<
    | "info"
    | "machine"
    | "contract"
    | "pesticide"
    | "supply"
    | "fertilizer"
    | string
  >("info");
  return (
    <Paper shadow="md" radius={8} p="xl" withBorder>
      <Stack gap={"xs"}>
        <Group mb="md">
          <Button
            variant="subtle"
            radius={4}
            leftSection={<IconArrowLeft size={18} />}
            onClick={() => navigate(-1)}
          >
            Quay lại
          </Button>
          <Title order={3}>Thông tin doanh nghiệp / nông hộ</Title>
        </Group>
        <Group>
          {[
            {
              label: "Thông tin cơ bản",
              value: "info",
            },

            {
              label: "Hợp đồng",
              value: "contract",
            },
            {
              label: "Máy móc",
              value: "machine",
            },
            {
              label: "Vật tư nông nghiệp",
              value: "supply",
            },
            {
              label: "Thuốc bảo vệ thực vật",
              value: "pesticide",
            },
            {
              label: "Phân bón",
              value: "fertilizer",
            },
          ].map((item) => (
            <Button
              key={item.value}
              radius={4}
              onClick={() => setTab(item.value)}
              variant={tab === item.value ? "filled" : "outline"}
            >
              {item.label}
            </Button>
          ))}
        </Group>
        {tab === "info" && <SimpleInfo />}
        {tab === "contract" && <ContractInfo />}
        {tab === "machine" && <MachineInfo />}
        {tab === "supply" && <SupplyInfo />}
        {tab === "pesticide" && <PesticideInfo />}
        {tab === "fertilizer" && <FertilizerInfo />}
      </Stack>
    </Paper>
  );
}
