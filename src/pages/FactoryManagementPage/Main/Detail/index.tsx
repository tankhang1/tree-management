import {
  Card,
  Stack,
  Text,
  Title,
  Group,
  Badge,
  Divider,
  Button,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
const factory = {
  factoryId: "FAC001",
  name: "Nhà máy chế biến A",
  location: "KCN Tân Bình, TP.HCM",
  areaSize: 12000,
  manager: "Nguyễn Văn A",
  departments: ["Sản xuất", "Kho", "QA/QC"],
  establishedDate: "2015-04-10",
  status: "Ngưng hoạt động",
};
const FactoryManagementMainDetailPage = () => {
  const navigate = useNavigate();
  return (
    <Stack justify="center" align="center">
      <Card w={"60%"} shadow="md" p="xl" radius="md" withBorder>
        <Stack gap="md">
          <Group mb={"md"}>
            <Button
              variant="subtle"
              radius={4}
              leftSection={<IconArrowLeft size={18} />}
              onClick={() => navigate(-1)}
            >
              Quay lại
            </Button>
            <Title order={3}>🏭 {factory.name}</Title>
          </Group>
          <Group>
            <Text size="sm" color="dimmed">
              Mã nhà máy:
            </Text>
            <Text>{factory.factoryId}</Text>
          </Group>
          <Group>
            <Text size="sm" color="dimmed">
              Địa chỉ:
            </Text>
            <Text>{factory.location}</Text>
          </Group>
          <Group>
            <Text size="sm" color="dimmed">
              Diện tích:
            </Text>
            <Text>{factory.areaSize.toLocaleString()} m²</Text>
          </Group>
          <Group>
            <Text size="sm" color="dimmed">
              Người quản lý:
            </Text>
            <Text>{factory.manager}</Text>
          </Group>
          <Group>
            <Text size="sm" color="dimmed">
              Ngày thành lập:
            </Text>
            <Text>
              {new Date(factory.establishedDate).toLocaleDateString("vi-VN")}
            </Text>
          </Group>
          <Divider />
          <Stack gap={4}>
            <Text size="sm" color="dimmed">
              Phòng ban:
            </Text>
            <Group>
              {factory.departments.map((dept) => (
                <Badge key={dept} color="blue" variant="light">
                  {dept}
                </Badge>
              ))}
            </Group>
          </Stack>
          <Group mt="md">
            <Text size="sm" color="dimmed">
              Trạng thái:
            </Text>
            <Badge
              color={factory.status === "Đang hoạt động" ? "green" : "red"}
            >
              {factory.status}
            </Badge>
          </Group>
        </Stack>
      </Card>
    </Stack>
  );
};
export default FactoryManagementMainDetailPage;
