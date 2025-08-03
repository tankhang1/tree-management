import {
  Group,
  Stack,
  Title,
  Text,
  Card,
  Button,
  SimpleGrid,
} from "@mantine/core";
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
        <Title order={3}>Thông tin doanh nghiệp / nông hộ</Title>
      </Group>
      <Stack gap="md">
        {/* THÔNG TIN CƠ BẢN */}
        <Stack>
          <Title order={5}>📄 Thông tin cơ bản</Title>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xs">
            <Group gap="xs">
              <IconBuildingFactory size={18} />
              <Text size="sm">Loại: {formData.type}</Text>
            </Group>
            <Group gap="xs">
              <IconId size={18} />
              <Text size="sm">Mã định danh: {formData.code}</Text>
            </Group>
            <Group gap="xs">
              <IconUser size={18} />
              <Text size="sm">Tên: {formData.name}</Text>
            </Group>
            <Group gap="xs">
              <IconUser size={18} />
              <Text size="sm">Thương hiệu: {formData.brand}</Text>
            </Group>
            <Group gap="xs">
              <IconUser size={18} />
              <Text size="sm">Người đại diện: {formData.representative}</Text>
            </Group>
            <Group gap="xs">
              <IconPhone size={18} />
              <Text size="sm">Số điện thoại: {formData.phone}</Text>
            </Group>
            <Group gap="xs">
              <IconMail size={18} />
              <Text size="sm">Email: {formData.email}</Text>
            </Group>
            <Group gap="xs">
              <IconMapPin size={18} />
              <Text size="sm">Địa chỉ: {formData.address}</Text>
            </Group>
            <Group gap="xs">
              <IconId size={18} />
              <Text size="sm">Mã số thuế: {formData.taxCode}</Text>
            </Group>
            <Group gap="xs">
              <IconMapPin size={18} />
              <Text size="sm">Địa chỉ thuế: {formData.taxAddress}</Text>
            </Group>
            <Group gap="xs">
              <Text size="sm">Phân loại: {formData.category}</Text>
            </Group>
            <Group gap="xs">
              <Text size="sm">Ghi chú: {formData.note}</Text>
            </Group>
          </SimpleGrid>
        </Stack>

        {/* CHI NHÁNH */}
        <Stack>
          <Title order={5}>🏢 Chi nhánh</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {branches.map((b, i) => (
              <Card key={i} withBorder radius="md" p="sm">
                <Stack gap={2}>
                  <Text size="sm">
                    <strong>Tên:</strong> {b.name}
                  </Text>
                  <Text size="sm">
                    <strong>SĐT:</strong> {b.phone}
                  </Text>
                  <Text size="sm">
                    <strong>Email:</strong> {b.email}
                  </Text>
                  <Text size="sm">
                    <strong>Địa chỉ:</strong> {b.address}
                  </Text>
                  <Text size="sm">
                    <strong>MST:</strong> {b.taxCode}
                  </Text>
                  <Text size="sm">
                    <strong>Địa chỉ thuế:</strong> {b.taxAddress}
                  </Text>
                  <Text size="sm">
                    <strong>Ghi chú:</strong> {b.note}
                  </Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>

        {/* NGÂN HÀNG */}
        <Stack>
          <Title order={5}>🏦 Ngân hàng</Title>
          <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
            {banks.map((b, i) => (
              <Card key={i} withBorder radius="md" p="sm">
                <Stack gap={2}>
                  <Text size="sm">
                    <strong>Ngân hàng:</strong> {b.bank}
                  </Text>
                  <Text size="sm">
                    <strong>Chủ tài khoản:</strong> {b.accountHolder}
                  </Text>
                  <Text size="sm">
                    <strong>Số tài khoản:</strong> {b.accountNumber}
                  </Text>
                  <Text size="sm">
                    <strong>Chi nhánh:</strong> {b.branch}
                  </Text>
                  <Text size="sm">
                    <strong>Ghi chú:</strong> {b.note}
                  </Text>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        </Stack>
      </Stack>
    </Card>
  );
};

export default CompanyDetailPage;
