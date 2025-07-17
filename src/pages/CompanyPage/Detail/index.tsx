import { Group, Stack, Title, Text, Paper, Card, Button } from "@mantine/core";
import { useState } from "react";
import {
  IconUser,
  IconPhone,
  IconMail,
  IconMapPin,
  IconBuildingFactory,
  IconId,
  IconArrowLeft,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const CompanyDetailPage = () => {
  const navigate = useNavigate();
  const [formData] = useState({
    type: "Doanh nghiệp",
    code: "DN001",
    name: "Công ty TNHH ABC",
    brand: "ABC Mart",
    representative: "Nguyễn Văn A",
    phone: "0909123456",
    email: "abc@company.vn",
    address: "123 Lê Lợi, Quận 1, TP.HCM",
    taxCode: "0301234567",
    taxAddress: "123 Lê Lợi, Quận 1, TP.HCM",
    category: "Khách hàng",
    note: "Khách hàng lâu năm",
  });
  const [branches] = useState([
    {
      name: "Chi nhánh Hà Nội",
      phone: "02412345678",
      email: "hanoi@company.vn",
      address: "456 Trần Duy Hưng, Cầu Giấy, Hà Nội",
      taxCode: "0102345678",
      taxAddress: "456 Trần Duy Hưng, Hà Nội",
      note: "Trụ sở phía Bắc",
    },
    {
      name: "Chi nhánh Hà Nội",
      phone: "02412345678",
      email: "hanoi@company.vn",
      address: "456 Trần Duy Hưng, Cầu Giấy, Hà Nội",
      taxCode: "0102345678",
      taxAddress: "456 Trần Duy Hưng, Hà Nội",
      note: "Trụ sở phía Bắc",
    },
  ]);
  const [banks] = useState([
    {
      bank: "Vietcombank (VCB)",
      accountHolder: "Nguyễn Văn A",
      accountNumber: "1234567890123",
      branch: "Vietcombank Quận 1",
      note: "Tài khoản chính",
    },
    {
      bank: "Vietcombank (VCB)",
      accountHolder: "Nguyễn Văn A",
      accountNumber: "1234567890123",
      branch: "Vietcombank Quận 1",
      note: "Tài khoản chính",
    },
  ]);

  return (
    <Card withBorder shadow="sm" radius={8} p="xl">
      <Group mb="md">
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Thông tin doanh nghiệp / hộ nông dân</Title>
      </Group>
      <Stack>
        <Paper withBorder p="md" radius="md">
          <Stack gap="xs">
            <Group>
              <IconBuildingFactory size={18} />
              <Text size="sm">Loại: {formData.type}</Text>
            </Group>
            <Group>
              <IconId size={18} />
              <Text size="sm">Mã định danh: {formData.code}</Text>
            </Group>
            <Group>
              <IconUser size={18} />
              <Text size="sm">Tên: {formData.name}</Text>
            </Group>
            <Group>
              <IconUser size={18} />
              <Text size="sm">Thương hiệu: {formData.brand}</Text>
            </Group>
            <Group>
              <IconUser size={18} />
              <Text size="sm">Người đại diện: {formData.representative}</Text>
            </Group>
            <Group>
              <IconPhone size={18} />
              <Text size="sm">Số điện thoại: {formData.phone}</Text>
            </Group>
            <Group>
              <IconMail size={18} />
              <Text size="sm">Email: {formData.email}</Text>
            </Group>
            <Group>
              <IconMapPin size={18} />
              <Text size="sm">Địa chỉ: {formData.address}</Text>
            </Group>
            <Group>
              <IconId size={18} />
              <Text size="sm">Mã số thuế: {formData.taxCode}</Text>
            </Group>
            <Group>
              <IconMapPin size={18} />
              <Text size="sm">Địa chỉ thuế: {formData.taxAddress}</Text>
            </Group>
            <Group>
              <Text size="sm">Phân loại: {formData.category}</Text>
            </Group>
            <Group>
              <Text size="sm">Ghi chú: {formData.note}</Text>
            </Group>
          </Stack>
        </Paper>

        <Title order={5} mt="md">
          Chi nhánh
        </Title>
        <Group grow>
          {branches.map((b, i) => (
            <Paper key={i} withBorder p="md" radius="md">
              <Stack gap="xs">
                <Text size="sm">Tên: {b.name}</Text>
                <Text size="sm">SĐT: {b.phone}</Text>
                <Text size="sm">Email: {b.email}</Text>
                <Text size="sm">Địa chỉ: {b.address}</Text>
                <Text size="sm">MST: {b.taxCode}</Text>
                <Text size="sm">Địa chỉ thuế: {b.taxAddress}</Text>
                <Text size="sm">Ghi chú: {b.note}</Text>
              </Stack>
            </Paper>
          ))}
        </Group>

        <Title order={5} mt="md">
          Ngân hàng
        </Title>
        <Group grow>
          {banks.map((b, i) => (
            <Paper key={i} withBorder p="md" radius="md">
              <Stack gap="xs">
                <Text size="sm">Ngân hàng: {b.bank}</Text>
                <Text size="sm">Chủ tài khoản: {b.accountHolder}</Text>
                <Text size="sm">Số tài khoản: {b.accountNumber}</Text>
                <Text size="sm">Chi nhánh: {b.branch}</Text>
                <Text size="sm">Ghi chú: {b.note}</Text>
              </Stack>
            </Paper>
          ))}
        </Group>
      </Stack>
    </Card>
  );
};

export default CompanyDetailPage;
