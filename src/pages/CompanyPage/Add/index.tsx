import {
  Stepper,
  Button,
  Group,
  TextInput,
  Textarea,
  Grid,
  Card,
  Stack,
  Title,
  Text,
  Paper,
  SimpleGrid,
  MultiSelect,
  ScrollArea,
  Input,
  Modal,
  Select,
  Image,
} from "@mantine/core";
import { useState } from "react";
import {
  IconArrowLeft,
  IconBuilding,
  IconBuildingBank,
  IconBuildingFactory,
  IconHeartHandshake,
  IconHome,
  IconId,
  IconMail,
  IconMap,
  IconMapPin,
  IconNote,
  IconPhone,
  IconPlus,
  IconTruck,
  IconTypeface,
  IconUser,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import BankSelect from "../../../components/BankList";
import { addressList } from "../../OrderManagementPage/Create";

export function CompanyAddPage() {
  const [openedAddressForm, setOpenedAddressForm] = useState(false);
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<
    "customer" | "partner" | "supplier" | "bank"
  >("customer");
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const [formData, setFormData] = useState({
    type: "Doanh nghiệp",
    code: "ENT-001",
    name: "Công ty TNHH Nông sản Xanh",
    brand: "GreenAgro",
    representative: "Nguyễn Văn A",
    phone: "0909123456",
    email: "contact@greenagro.vn",
    address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
    taxCode: "0301234567",
    taxAddress: "123 Đường Trần Hưng Đạo, Quận 5, TP.HCM",
    category: "Sản xuất & phân phối",
    note: "Khách hàng ưu tiên",
  });
  const [branches, setBranches] = useState([
    {
      name: "Chi nhánh Hà Nội",
      phone: "0241234567",
      email: "hanoi@greenagro.vn",
      address: "456 Phố Huế, Hai Bà Trưng, Hà Nội",
      taxCode: "0101122334",
      taxAddress: "456 Trần Nhân Tông, Hai Bà Trưng, Hà Nội",
      note: "Chi nhánh phía Bắc",
    },
    {
      name: "Chi nhánh Cần Thơ",
      phone: "02921234567",
      email: "cantho@greenagro.vn",
      address: "789 Nguyễn Trãi, Ninh Kiều, Cần Thơ",
      taxCode: "1800456789",
      taxAddress: "789 Hòa Bình, Ninh Kiều, Cần Thơ",
      note: "Chi nhánh miền Tây",
    },
  ]);
  const [banks, setBanks] = useState([
    {
      bank: "Techcombank (TCB)",
      accountHolder: "Nguyễn Văn A",
      accountNumber: "19001234567890",
      branch: "Chi nhánh Sài Gòn",
      note: "Tài khoản giao dịch chính",
    },
    {
      bank: "Vietcombank (VCB)",
      accountHolder: "Nguyễn Văn A",
      accountNumber: "0011001234567",
      branch: "Chi nhánh Hà Nội",
      note: "Dùng cho thanh toán nội bộ",
    },
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
        <Title order={3}>Tạo mới doanh nghiệp / nông hộ</Title>
      </Group>

      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="Bước 1" description="Thông tin cơ bản">
          <Group grow align="flex-start">
            <Card withBorder radius={4}>
              <Stack gap={"xs"}>
                <Title order={6}>Thông tin cơ bản</Title>
                <Group>
                  <Button
                    leftSection={<IconBuilding size={18} />}
                    variant="filled"
                    radius={4}
                  >
                    Doanh nghiệp
                  </Button>
                  <Button
                    leftSection={<IconHome size={18} />}
                    variant="outline"
                    radius={4}
                  >
                    Nông hộ
                  </Button>
                  <Button
                    leftSection={<IconMap size={18} />}
                    variant="outline"
                    radius={4}
                  >
                    Hợp tác xã
                  </Button>
                </Group>
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
                <Group align="flex-end">
                  <TextInput
                    label="Địa chỉ"
                    placeholder={"Tìm kiếm địa chỉ"}
                    radius={4}
                    flex={1}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                  />
                  <Button onClick={() => setOpenedAddressForm(true)} radius={4}>
                    Thêm mới
                  </Button>
                </Group>
                <ScrollArea>
                  <Group wrap="nowrap" align="flex-start" gap="md">
                    {addressList.map((address) => (
                      <Card
                        key={address.id}
                        miw={300}
                        withBorder
                        shadow="sm"
                        radius="md"
                        p="lg"
                        style={{
                          cursor: "pointer",
                          borderColor:
                            selectedAddress === address.id
                              ? "green"
                              : undefined,
                        }}
                        onClick={() => setSelectedAddress(address.id)}
                      >
                        <Stack gap="xs">
                          <Group justify="space-between">
                            <Title order={4} fw={500}>
                              {address.recipientName}
                            </Title>
                          </Group>
                          <Text size="sm">
                            <b>Số điện thoại:</b> {address.phoneNumber}
                          </Text>
                          <Text size="sm">
                            <b>Địa chỉ:</b> {address.address}
                          </Text>
                        </Stack>
                      </Card>
                    ))}
                  </Group>
                </ScrollArea>
                <Input.Wrapper label="Phân loại">
                  <Group gap="md">
                    <Button
                      variant={
                        selectedCategory === "customer" ? "filled" : "outline"
                      }
                      leftSection={<IconUser size={18} />}
                      onClick={() => setSelectedCategory("customer")}
                      radius={4}
                    >
                      Khách hàng
                    </Button>
                    <Button
                      variant={
                        selectedCategory === "partner" ? "filled" : "outline"
                      }
                      leftSection={<IconHeartHandshake size={18} />}
                      onClick={() => setSelectedCategory("partner")}
                      radius={4}
                    >
                      Đối tác
                    </Button>
                    <Button
                      variant={
                        selectedCategory === "supplier" ? "filled" : "outline"
                      }
                      leftSection={<IconTruck size={18} />}
                      onClick={() => setSelectedCategory("supplier")}
                      radius={4}
                    >
                      Nhà cung cấp
                    </Button>
                    <Button
                      variant={
                        selectedCategory === "bank" ? "filled" : "outline"
                      }
                      leftSection={<IconBuildingBank size={18} />}
                      onClick={() => setSelectedCategory("bank")}
                      radius={4}
                    >
                      Ngân hàng
                    </Button>
                  </Group>
                </Input.Wrapper>
              </Stack>
            </Card>
            <Stack>
              <Card withBorder radius={4}>
                <Stack gap={"xs"}>
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
              </Card>
              <Card withBorder radius={4}>
                <Stack gap={"xs"}>
                  <Title order={6}>Mối quan hệ</Title>
                  <MultiSelect
                    radius={4}
                    data={[
                      "Khách hàng",
                      "Nhà cung cấp",
                      "Đối tác",
                      "Đối tác chiến lược",
                    ]}
                  />
                </Stack>
              </Card>
            </Stack>
          </Group>
        </Stepper.Step>

        <Stepper.Step label="Bước 2" description="Thông tin chi nhánh">
          <Stack gap={"xs"}>
            {branches.map((b, idx) => (
              <Card key={idx} withBorder radius={4}>
                <Stack gap={"xs"}>
                  <Group grow align="flex-start">
                    <Stack gap={"xs"}>
                      <Title order={6}>Thông tin chi nhánh</Title>

                      <TextInput label="Tên chi nhánh" radius={4} />
                      <TextInput label="Số điện thoại" radius={4} />
                      <TextInput label="Email" radius={4} />
                      <Group align="flex-end">
                        <TextInput
                          label="Địa chỉ"
                          placeholder={"Tìm kiếm địa chỉ"}
                          radius={4}
                          flex={1}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                        />
                        <Button
                          onClick={() => setOpenedAddressForm(true)}
                          radius={4}
                        >
                          Thêm mới
                        </Button>
                      </Group>
                      <ScrollArea>
                        <Group wrap="nowrap" align="flex-start" gap="md">
                          {addressList.map((address) => (
                            <Card
                              key={address.id}
                              miw={300}
                              withBorder
                              shadow="sm"
                              radius="md"
                              p="lg"
                              style={{
                                cursor: "pointer",
                                borderColor:
                                  selectedAddress === address.id
                                    ? "green"
                                    : undefined,
                              }}
                              onClick={() => setSelectedAddress(address.id)}
                            >
                              <Stack gap="xs">
                                <Group justify="space-between">
                                  <Title order={4} fw={500}>
                                    {address.recipientName}
                                  </Title>
                                </Group>
                                <Text size="sm">
                                  <b>Số điện thoại:</b> {address.phoneNumber}
                                </Text>
                                <Text size="sm">
                                  <b>Địa chỉ:</b> {address.address}
                                </Text>
                              </Stack>
                            </Card>
                          ))}
                        </Group>
                      </ScrollArea>
                    </Stack>

                    <Stack gap={"xs"}>
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
                          setFormData({
                            ...formData,
                            taxAddress: e.target.value,
                          })
                        }
                      />
                      {/* <Select
                        label="Phân loại"
                        radius={4}
                        data={["Khách hàng", "Nhà cung cấp", "Đối tác"]}
                        value={formData.category}
                        onChange={(val) =>
                          setFormData({ ...formData, category: val! })
                        }
                      /> */}
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
                  </Group>
                  <Group justify="flex-end">
                    <Button
                      color="red"
                      radius={4}
                      variant="light"
                      onClick={() =>
                        setBranches(branches.filter((_, i) => i !== idx))
                      }
                    >
                      Xoá
                    </Button>
                  </Group>
                </Stack>
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
                    <BankSelect />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput label="Chủ tài khoản" radius={4} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput label="Số tài khoản" radius={4} />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Select
                      label="Chi nhánh (nếu có)"
                      radius={4}
                      data={[
                        { value: "hanoi", label: "Chi nhánh Hà Nội" },
                        { value: "saigon", label: "Chi nhánh Sài Gòn" },
                        { value: "danang", label: "Chi nhánh Đà Nẵng" },
                        { value: "cantho", label: "Chi nhánh Cần Thơ" },
                      ]}
                    />
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
          <Card withBorder radius="md" shadow="xs" p="lg">
            <Stack gap="md">
              {/* THÔNG TIN CƠ BẢN */}
              <Stack>
                <Title order={5}>📄 Thông tin cơ bản</Title>
                <Group grow>
                  <Card h={230} withBorder radius="md" p="sm">
                    <Stack gap={"xs"}>
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
                        <Text size="sm">
                          Người đại diện: {formData.representative}
                        </Text>
                      </Group>
                      <Group gap="xs">
                        <IconPhone size={18} />
                        <Text size="sm">Số điện thoại: {formData.phone}</Text>
                      </Group>
                      <Group gap="xs">
                        <IconMail size={18} />
                        <Text size="sm">Email: {formData.email}</Text>
                      </Group>
                    </Stack>
                  </Card>
                  <Card h={230} withBorder radius="md" p="sm">
                    <Stack gap={"xs"}>
                      <Group gap="xs">
                        <IconId size={18} />
                        <Text size="sm">Mã số thuế: {formData.taxCode}</Text>
                      </Group>
                      <Group gap="xs">
                        <IconMapPin size={18} />
                        <Text size="sm">
                          Địa chỉ thuế: {formData.taxAddress}
                        </Text>
                      </Group>
                      <Group gap="xs">
                        <IconTypeface size={18} />
                        <Text size="sm">Phân loại: {formData.category}</Text>
                      </Group>
                      <Group gap="xs">
                        <IconNote size={18} />
                        <Text size="sm">Ghi chú: {formData.note}</Text>
                      </Group>
                      <Group gap="xs">
                        <IconMapPin size={18} />
                        <Text size="sm">Địa chỉ: {formData.address}</Text>
                      </Group>
                    </Stack>
                  </Card>
                </Group>
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
        </Stepper.Step>

        <Stepper.Completed>
          <Stack align="center" justify="center" mt="xl">
            <Image
              src={
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjPNbBpZeXnXfTuA6AWek-Kj8NYEVbYdG6ayi5bIWarDuryXDrILdKMTd597quLD0PBKM&usqp=CAU"
              }
              w={200}
              fit="cover"
            />
            <Text fz={"h2"} ta="center">
              Tạo mới doanh nghiệp / nông hộ thành công!
            </Text>
            <Text fz={"md"} ta="center" c="dimmed">
              Doanh nghiệp / nông hộ mới đã được thêm thành công. Bạn có thể
            </Text>

            <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
              Xác nhận
            </Button>
          </Stack>
        </Stepper.Completed>
      </Stepper>

      {active < 4 && (
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
            {active === 3 ? "Hoàn thành" : "Tiếp theo"}
          </Button>
        </Group>
      )}

      <Modal
        opened={openedAddressForm}
        onClose={() => setOpenedAddressForm(false)}
        title={<Text fw={500}>Thêm địa chỉ mới</Text>}
      >
        <Stack gap="xs">
          <TextInput
            label="Tên người nhận"
            placeholder="Nhập tên người nhận"
            radius={4}
            withAsterisk
          />
          <TextInput
            label="Số điện thoại"
            placeholder="Nhập số điện thoại"
            radius={4}
            withAsterisk
          />
          <TextInput label="Email" placeholder="Nhập email" radius={4} />
          <TextInput
            label="Địa chỉ"
            placeholder="Nhập địa chỉ"
            radius={4}
            withAsterisk
          />
          <Textarea
            label="Ghi chú"
            placeholder="Nhập ghi chú (nếu có)"
            radius={4}
            minRows={3}
          />
          <Group justify="flex-end">
            <Button
              variant="outline"
              radius={4}
              onClick={() => setOpenedAddressForm(false)}
            >
              Hủy
            </Button>
            <Button radius={4} onClick={() => setOpenedAddressForm(false)}>
              Lưu
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Paper>
  );
}
