import {
  Stepper,
  Button,
  Group,
  TextInput,
  Textarea,
  Select,
  Grid,
  Card,
  Stack,
  Title,
  ActionIcon,
  Text,
  Paper,
} from "@mantine/core";
import { useState } from "react";
import {
  IconArrowLeft,
  IconBuildingFactory,
  IconId,
  IconMail,
  IconMapPin,
  IconPhone,
  IconPlus,
  IconTrash,
  IconUser,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";

const banksData = [
  { label: "Vietcombank (VCB)", value: "vcb" },
  { label: "VietinBank (CTG)", value: "ctg" },
  { label: "BIDV (BID)", value: "bid" },
  { label: "Techcombank (TCB)", value: "tcb" },
];

export function CompanyAddPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [formData, setFormData] = useState({
    type: "",
    code: "",
    name: "",
    brand: "",
    representative: "",
    phone: "",
    email: "",
    address: "",
    taxCode: "",
    taxAddress: "",
    category: "",
    note: "",
  });
  const [branches, setBranches] = useState([
    {
      name: "",
      phone: "",
      email: "",
      address: "",
      taxCode: "",
      taxAddress: "",
      note: "",
    },
  ]);
  const [banks, setBanks] = useState([
    { bank: "", accountHolder: "", accountNumber: "", branch: "", note: "" },
  ]);

  const nextStep = () =>
    setActive((current) => (current < 4 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  return (
    <Paper shadow="md" radius={8} p="xl" withBorder>
      <Group mb="md">
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Tạo mới doanh nghiệp / hộ nông dân</Title>
      </Group>

      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="Bước 1" description="Thông tin cơ bản">
          <Stack gap={"xs"}>
            <Select
              label="Loại đối tượng"
              data={["Doanh nghiệp", "Nông hộ", "Hợp tác xã"]}
              placeholder="Chọn loại"
              value={formData.type}
              radius={4}
              onChange={(val) => setFormData({ ...formData, type: val! })}
            />
            <TextInput
              label="Mã định danh"
              value={formData.code}
              radius={4}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value })
              }
            />
            <TextInput
              label="Tên đối tượng"
              placeholder="Công ty TNHH ABC"
              value={formData.name}
              radius={4}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <TextInput
              label="Thương hiệu"
              placeholder="ABC Mart"
              value={formData.brand}
              radius={4}
              onChange={(e) =>
                setFormData({ ...formData, brand: e.target.value })
              }
            />
            <TextInput
              label="Người đại diện"
              value={formData.representative}
              radius={4}
              onChange={(e) =>
                setFormData({ ...formData, representative: e.target.value })
              }
            />
            <TextInput
              label="Số điện thoại"
              value={formData.phone}
              radius={4}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />
            <TextInput
              label="Email"
              value={formData.email}
              radius={4}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <TextInput
              label="Địa chỉ"
              value={formData.address}
              radius={4}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
            />
            <Title order={6}>Thông tin thuế</Title>
            <TextInput
              label="Mã số thuế (MST)"
              radius={4}
              value={formData.taxCode}
              onChange={(e) =>
                setFormData({ ...formData, taxCode: e.target.value })
              }
            />
            <TextInput
              label="Địa chỉ thuế"
              value={formData.taxAddress}
              radius={4}
              onChange={(e) =>
                setFormData({ ...formData, taxAddress: e.target.value })
              }
            />
            <Select
              label="Phân loại"
              radius={4}
              data={["Khách hàng", "Nhà cung cấp", "Đối tác"]}
              value={formData.category}
              onChange={(val) => setFormData({ ...formData, category: val! })}
            />
            <Textarea
              label="Ghi chú"
              radius={4}
              minRows={2}
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
            />
          </Stack>
        </Stepper.Step>

        <Stepper.Step label="Bước 2" description="Thông tin chi nhánh">
          <Stack gap={"xs"}>
            {branches.map((b, idx) => (
              <Card key={idx} withBorder>
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput label="Tên chi nhánh" radius={4} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput label="Số điện thoại" radius={4} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput label="Email" radius={4} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput label="Địa chỉ" radius={4} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput label="MST" radius={4} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput label="Địa chỉ thuế" radius={4} />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Textarea label="Ghi chú" radius={4} minRows={2} />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Group justify="flex-end">
                      <ActionIcon
                        color="red"
                        radius={4}
                        variant="light"
                        onClick={() =>
                          setBranches(branches.filter((_, i) => i !== idx))
                        }
                      >
                        <IconTrash />
                      </ActionIcon>
                    </Group>
                  </Grid.Col>
                </Grid>
              </Card>
            ))}
            <Button
              variant="light"
              radius={4}
              leftSection={<IconPlus />}
              onClick={() =>
                setBranches([
                  ...branches,
                  {
                    name: "",
                    phone: "",
                    email: "",
                    address: "",
                    taxCode: "",
                    taxAddress: "",
                    note: "",
                  },
                ])
              }
            >
              Thêm chi nhánh
            </Button>
          </Stack>
        </Stepper.Step>

        <Stepper.Step label="Bước 3" description="Thông tin ngân hàng">
          <Stack gap={"xs"}>
            {banks.map((bank, idx) => (
              <Card key={idx} withBorder>
                <Grid>
                  <Grid.Col span={6}>
                    <Select label="Ngân hàng" radius={4} data={banksData} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput label="Chủ tài khoản" radius={4} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput label="Số tài khoản" />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput label="Chi nhánh (nếu có)" />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Textarea label="Ghi chú" minRows={2} radius={4} />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Group justify="flex-end">
                      <Button
                        color="red"
                        variant="light"
                        radius={4}
                        onClick={() =>
                          setBanks(banks.filter((_, i) => i !== idx))
                        }
                      >
                        Xoá
                      </Button>
                    </Group>
                  </Grid.Col>
                </Grid>
              </Card>
            ))}
            <Button
              variant="light"
              radius={4}
              leftSection={<IconPlus />}
              onClick={() =>
                setBanks([
                  ...banks,
                  {
                    bank: "",
                    accountHolder: "",
                    accountNumber: "",
                    branch: "",
                    note: "",
                  },
                ])
              }
            >
              Thêm tài khoản ngân hàng
            </Button>
          </Stack>
        </Stepper.Step>

        <Stepper.Step label="Bước 4" description="Xác nhận thông tin">
          <Stack gap={"xs"}>
            <Title order={5}>Thông tin cơ bản</Title>
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

            <Title order={5} mt="md">
              Chi nhánh
            </Title>
            {branches.map((b, i) => (
              <Card key={i} withBorder>
                <Text size="sm">Tên: {b.name}</Text>
                <Text size="sm">SĐT: {b.phone}</Text>
                <Text size="sm">Email: {b.email}</Text>
                <Text size="sm">Địa chỉ: {b.address}</Text>
                <Text size="sm">MST: {b.taxCode}</Text>
                <Text size="sm">Địa chỉ thuế: {b.taxAddress}</Text>
                <Text size="sm">Ghi chú: {b.note}</Text>
              </Card>
            ))}

            <Title order={5} mt="md">
              Ngân hàng
            </Title>
            {banks.map((b, i) => (
              <Card key={i} withBorder>
                <Text size="sm">Ngân hàng: {b.bank}</Text>
                <Text size="sm">Chủ tài khoản: {b.accountHolder}</Text>
                <Text size="sm">Số tài khoản: {b.accountNumber}</Text>
                <Text size="sm">Chi nhánh: {b.branch}</Text>
                <Text size="sm">Ghi chú: {b.note}</Text>
              </Card>
            ))}
          </Stack>
        </Stepper.Step>

        <Stepper.Completed>
          <Title order={4}>Xác nhận tạo mới thông tin thành công!</Title>
        </Stepper.Completed>
      </Stepper>

      <Group justify="space-between" mt="xl">
        <Button
          variant="default"
          radius={4}
          onClick={prevStep}
          disabled={active === 0}
        >
          Quay lại
        </Button>
        <Button radius={4} onClick={nextStep}>
          {active === 4 ? "Hoàn tất" : "Tiếp theo"}
        </Button>
      </Group>
    </Paper>
  );
}
