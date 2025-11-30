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
  MultiSelect,
  Input,
  Modal,
  Select,
  Image,
  LoadingOverlay,
  Badge,
  Divider,
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
  IconUser,
  IconCheck,
  IconTrash,
} from "@tabler/icons-react";
import { useNavigate } from "react-router-dom";
import { notifications } from "@mantine/notifications";

// Component con (Giả định đã có)
import BankSelect from "../../../components/BankList";
import { addressList } from "../../OrderManagementPage/Create";
import Scrollable from "../../../components/Scrollable";
import { useCompanyStore } from "../../zustand/companyStore";

const CompanyAddPage = () => {
  const navigate = useNavigate();
  const { addCompany, isLoading } = useCompanyStore();

  const [openedAddressForm, setOpenedAddressForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    "customer" | "partner" | "supplier" | "bank"
  >("customer");
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [active, setActive] = useState(0);

  // --- 1. STATE QUẢN LÝ DỮ LIỆU ---
  const [formData, setFormData] = useState({
    type: "Doanh nghiệp",
    code: "ENT-" + Math.floor(Math.random() * 1000),
    name: "",
    brand: "",
    representative: "",
    phone: "",
    email: "",
    address: "",
    taxCode: "",
    taxAddress: "",
    category: "", // Text phân loại nhập tay
    note: "",
    relations: [], // MultiSelect value
  });

  const [branches, setBranches] = useState([
    {
      name: "Chi nhánh chính",
      phone: "",
      email: "",
      address: "",
      taxCode: "",
      taxAddress: "",
      note: "",
    },
  ]);

  const [banks, setBanks] = useState([
    {
      bank: "",
      accountHolder: "",
      accountNumber: "",
      branch: "",
      note: "",
    },
  ]);

  const [contacts, setContacts] = useState([
    {
      name: "",
      phone: "",
      email: "",
      role: "",
      organization: "",
      address: "",
      note: "",
    },
  ]);

  // --- 2. CÁC HÀM XỬ LÝ LOGIC (HANDLERS) ---

  // Xử lý thay đổi thông tin cơ bản
  const handleFormChange = (key: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  // Xử lý Chi nhánh (Branches)
  const handleBranchChange = (index: number, key: string, value: string) => {
    const newBranches: any = [...branches];
    newBranches[index][key] = value;
    setBranches(newBranches);
  };
  const addBranch = () => {
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
    ]);
  };
  const removeBranch = (index: number) => {
    setBranches(branches.filter((_, i) => i !== index));
  };

  // Xử lý Ngân hàng (Banks)
  const handleBankChange = (
    index: number,
    key: string,
    value: string | null
  ) => {
    const newBanks: any = [...banks];
    newBanks[index][key] = value || "";
    setBanks(newBanks);
  };
  const addBank = () => {
    setBanks([
      ...banks,
      { bank: "", accountHolder: "", accountNumber: "", branch: "", note: "" },
    ]);
  };
  const removeBank = (index: number) => {
    setBanks(banks.filter((_, i) => i !== index));
  };

  // Xử lý Liên hệ (Contacts)
  const handleContactChange = (index: number, key: string, value: string) => {
    const newContacts: any = [...contacts];
    newContacts[index][key] = value;
    setContacts(newContacts);
  };
  const addContact = () => {
    setContacts([
      ...contacts,
      {
        name: "",
        phone: "",
        email: "",
        role: "",
        organization: "",
        address: "",
        note: "",
      },
    ]);
  };
  const removeContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  // Điều hướng Stepper
  const nextStep = () =>
    setActive((current) => (current < 5 ? current + 1 : current));
  const prevStep = () =>
    setActive((current) => (current > 0 ? current - 1 : current));

  // --- 3. LOGIC LƯU DỮ LIỆU ---
  const handleConfirmSave = async () => {
    // Validate cơ bản
    if (!formData.name) {
      notifications.show({
        title: "Lỗi",
        message: "Vui lòng nhập tên đối tượng",
        color: "red",
      });
      setActive(0); // Quay về bước 1
      return;
    }

    const finalData = {
      ...formData,
      categoryType: selectedCategory, // Lưu loại tab đang chọn (Customer/Partner...)
      branches: branches,
      banks: banks,
      contacts: contacts,
    };

    const success = await addCompany(finalData);

    if (success) {
      notifications.show({
        title: "Thành công",
        message: "Đã tạo mới doanh nghiệp!",
        color: "green",
        icon: <IconCheck />,
      });
      setActive(5); // Chuyển sang màn hình hoàn tất
    } else {
      notifications.show({
        title: "Lỗi",
        message: "Có lỗi xảy ra, vui lòng thử lại.",
        color: "red",
      });
    }
  };

  return (
    <Paper shadow="md" radius={8} p="xl" withBorder pos="relative">
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: "sm", blur: 2 }}
      />

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
        {/* --- BƯỚC 1: THÔNG TIN CƠ BẢN --- */}
        <Stepper.Step label="Bước 1" description="Thông tin cơ bản">
          <Group grow align="flex-start">
            <Card withBorder radius={4}>
              <Stack gap={"xs"}>
                <Title order={6}>Thông tin cơ bản</Title>
                <Group>
                  <Button
                    leftSection={<IconBuilding size={18} />}
                    variant={
                      formData.type === "Doanh nghiệp" ? "filled" : "outline"
                    }
                    onClick={() => handleFormChange("type", "Doanh nghiệp")}
                    radius={4}
                  >
                    Doanh nghiệp
                  </Button>
                  <Button
                    leftSection={<IconHome size={18} />}
                    variant={formData.type === "Nông hộ" ? "filled" : "outline"}
                    onClick={() => handleFormChange("type", "Nông hộ")}
                    radius={4}
                  >
                    Nông hộ
                  </Button>
                  <Button
                    leftSection={<IconMap size={18} />}
                    variant={
                      formData.type === "Hợp tác xã" ? "filled" : "outline"
                    }
                    onClick={() => handleFormChange("type", "Hợp tác xã")}
                    radius={4}
                  >
                    Hợp tác xã
                  </Button>
                </Group>

                <TextInput
                  label="Mã định danh"
                  value={formData.code}
                  onChange={(e) =>
                    handleFormChange("code", e.currentTarget.value)
                  }
                  radius={4}
                />
                <TextInput
                  label="Tên đối tượng"
                  placeholder="Công ty TNHH ABC"
                  withAsterisk
                  value={formData.name}
                  onChange={(e) =>
                    handleFormChange("name", e.currentTarget.value)
                  }
                  radius={4}
                />
                <TextInput
                  label="Thương hiệu"
                  placeholder="ABC Mart"
                  value={formData.brand}
                  onChange={(e) =>
                    handleFormChange("brand", e.currentTarget.value)
                  }
                  radius={4}
                />
                <TextInput
                  label="Người đại diện"
                  value={formData.representative}
                  onChange={(e) =>
                    handleFormChange("representative", e.currentTarget.value)
                  }
                  radius={4}
                />
                <TextInput
                  label="Số điện thoại"
                  value={formData.phone}
                  onChange={(e) =>
                    handleFormChange("phone", e.currentTarget.value)
                  }
                  radius={4}
                />
                <TextInput
                  label="Email"
                  value={formData.email}
                  onChange={(e) =>
                    handleFormChange("email", e.currentTarget.value)
                  }
                  radius={4}
                />
                <Group align="flex-end">
                  <TextInput
                    label="Địa chỉ"
                    placeholder={"Tìm kiếm địa chỉ"}
                    radius={4}
                    flex={1}
                    value={formData.address}
                    onChange={(e) =>
                      handleFormChange("address", e.currentTarget.value)
                    }
                  />
                  <Button onClick={() => setOpenedAddressForm(true)} radius={4}>
                    Thêm mới
                  </Button>
                </Group>
                <Scrollable h={150}>
                  <Group wrap="nowrap" align="flex-start" gap="md">
                    {addressList.map((address) => (
                      <Card
                        key={address.id}
                        miw={300}
                        h={150}
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
                        onClick={() => {
                          setSelectedAddress(address.id);
                          handleFormChange("address", address.address);
                        }}
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
                </Scrollable>

                {/* <Input.Wrapper label="Phân loại">
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
                     Khác
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
                </Input.Wrapper> */}
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
                      handleFormChange("taxCode", e.currentTarget.value)
                    }
                  />
                  <TextInput
                    label="Địa chỉ thuế"
                    value={formData.taxAddress}
                    onChange={(e) =>
                      handleFormChange("taxAddress", e.currentTarget.value)
                    }
                    radius={4}
                  />
                  <Textarea
                    label="Ghi chú"
                    radius={4}
                    minRows={2}
                    value={formData.note}
                    onChange={(e) =>
                      handleFormChange("note", e.currentTarget.value)
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
                    value={formData.relations}
                    onChange={(val) => handleFormChange("relations", val)}
                  />
                </Stack>
              </Card>
            </Stack>
          </Group>
        </Stepper.Step>

        {/* --- BƯỚC 2: CHI NHÁNH --- */}
        <Stepper.Step label="Bước 2" description="Thông tin chi nhánh">
          <Stack gap={"xs"}>
            {branches.map((b, idx) => (
              <Card key={idx} withBorder radius={4}>
                <Stack gap={"xs"}>
                  <Group grow align="flex-start">
                    <Stack gap={"xs"}>
                      <Title order={6}>Thông tin chi nhánh {idx + 1}</Title>
                      <TextInput
                        label="Tên chi nhánh"
                        radius={4}
                        value={b.name}
                        onChange={(e) =>
                          handleBranchChange(idx, "name", e.currentTarget.value)
                        }
                      />
                      <TextInput
                        label="Số điện thoại"
                        radius={4}
                        value={b.phone}
                        onChange={(e) =>
                          handleBranchChange(
                            idx,
                            "phone",
                            e.currentTarget.value
                          )
                        }
                      />
                      <TextInput
                        label="Email"
                        radius={4}
                        value={b.email}
                        onChange={(e) =>
                          handleBranchChange(
                            idx,
                            "email",
                            e.currentTarget.value
                          )
                        }
                      />
                      <TextInput
                        label="Địa chỉ"
                        radius={4}
                        value={b.address}
                        onChange={(e) =>
                          handleBranchChange(
                            idx,
                            "address",
                            e.currentTarget.value
                          )
                        }
                      />
                    </Stack>
                    <Stack gap={"xs"}>
                      <Title order={6}>Thông tin thuế</Title>
                      <TextInput
                        label="Mã số thuế (MST)"
                        radius={4}
                        value={b.taxCode}
                        onChange={(e) =>
                          handleBranchChange(
                            idx,
                            "taxCode",
                            e.currentTarget.value
                          )
                        }
                      />
                      <TextInput
                        label="Địa chỉ thuế"
                        radius={4}
                        value={b.taxAddress}
                        onChange={(e) =>
                          handleBranchChange(
                            idx,
                            "taxAddress",
                            e.currentTarget.value
                          )
                        }
                      />
                      <Textarea
                        label="Ghi chú"
                        radius={4}
                        minRows={2}
                        value={b.note}
                        onChange={(e) =>
                          handleBranchChange(idx, "note", e.currentTarget.value)
                        }
                      />
                    </Stack>
                  </Group>
                  <Group justify="flex-end">
                    <Button
                      color="red"
                      radius={4}
                      variant="light"
                      onClick={() => removeBranch(idx)}
                      leftSection={<IconTrash size={16} />}
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
              onClick={addBranch}
            >
              Thêm chi nhánh
            </Button>
          </Stack>
        </Stepper.Step>

        {/* --- BƯỚC 3: NGÂN HÀNG --- */}
        <Stepper.Step label="Bước 3" description="Thông tin ngân hàng">
          <Stack gap={"xs"}>
            {banks.map((bank, idx) => (
              <Card key={idx} withBorder>
                <Grid>
                  <Grid.Col span={6}>
                    {/* Giả sử BankSelect là component hiển thị, thêm Select thật để lấy dữ liệu */}
                    <Select
                      label="Chọn ngân hàng"
                      data={[
                        "Vietcombank",
                        "Techcombank",
                        "MBBank",
                        "ACB",
                        "BIDV",
                      ]}
                      value={bank.bank}
                      onChange={(val) => handleBankChange(idx, "bank", val)}
                      radius={4}
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Chủ tài khoản"
                      radius={4}
                      value={bank.accountHolder}
                      onChange={(e) =>
                        handleBankChange(
                          idx,
                          "accountHolder",
                          e.currentTarget.value
                        )
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Số tài khoản"
                      radius={4}
                      value={bank.accountNumber}
                      onChange={(e) =>
                        handleBankChange(
                          idx,
                          "accountNumber",
                          e.currentTarget.value
                        )
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Select
                      label="Chi nhánh (nếu có)"
                      radius={4}
                      data={[
                        "Chi nhánh Hà Nội",
                        "Chi nhánh Sài Gòn",
                        "Chi nhánh Đà Nẵng",
                      ]}
                      value={bank.branch}
                      onChange={(val) => handleBankChange(idx, "branch", val)}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Textarea
                      label="Ghi chú"
                      minRows={2}
                      radius={4}
                      value={bank.note}
                      onChange={(e) =>
                        handleBankChange(idx, "note", e.currentTarget.value)
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Group justify="flex-end">
                      <Button
                        color="red"
                        variant="light"
                        radius={4}
                        onClick={() => removeBank(idx)}
                        leftSection={<IconTrash size={16} />}
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
              onClick={addBank}
            >
              Thêm tài khoản ngân hàng
            </Button>
          </Stack>
        </Stepper.Step>

        {/* --- BƯỚC 4: LIÊN HỆ --- */}
        <Stepper.Step label="Bước 4" description="Thông tin liên hệ">
          <Stack gap="xs">
            {contacts.map((contact, idx) => (
              <Card key={idx} withBorder radius="md" shadow="sm">
                <Grid>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Họ tên"
                      radius={4}
                      value={contact.name}
                      onChange={(e) =>
                        handleContactChange(idx, "name", e.currentTarget.value)
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Số điện thoại"
                      radius={4}
                      value={contact.phone}
                      onChange={(e) =>
                        handleContactChange(idx, "phone", e.currentTarget.value)
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Email"
                      radius={4}
                      value={contact.email}
                      onChange={(e) =>
                        handleContactChange(idx, "email", e.currentTarget.value)
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Chức vụ"
                      radius={4}
                      value={contact.role}
                      onChange={(e) =>
                        handleContactChange(idx, "role", e.currentTarget.value)
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Phòng ban"
                      radius={4}
                      value={contact.organization}
                      onChange={(e) =>
                        handleContactChange(
                          idx,
                          "organization",
                          e.currentTarget.value
                        )
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <TextInput
                      label="Địa chỉ"
                      radius={4}
                      value={contact.address}
                      onChange={(e) =>
                        handleContactChange(
                          idx,
                          "address",
                          e.currentTarget.value
                        )
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Textarea
                      label="Ghi chú"
                      minRows={2}
                      radius={4}
                      value={contact.note}
                      onChange={(e) =>
                        handleContactChange(idx, "note", e.currentTarget.value)
                      }
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Group justify="flex-end">
                      <Button
                        color="red"
                        variant="light"
                        radius={4}
                        onClick={() => removeContact(idx)}
                        leftSection={<IconTrash size={16} />}
                      >
                        Xoá liên hệ
                      </Button>
                    </Group>
                  </Grid.Col>
                </Grid>
              </Card>
            ))}
            <Button
              variant="outline"
              radius={4}
              leftSection={<IconPlus />}
              onClick={addContact}
            >
              Thêm liên hệ
            </Button>
          </Stack>
        </Stepper.Step>

        {/* --- BƯỚC 5: XÁC NHẬN --- */}
        <Stepper.Step label="Bước 5" description="Xác nhận thông tin">
          <Stack gap="lg">
            {/* 1. THÔNG TIN CHUNG */}
            <Card withBorder radius="md" shadow="sm" padding="lg">
              <Title order={5} mb="md" c="blue">
                📄 Thông tin chung
              </Title>
              <Grid gutter="md">
                <Grid.Col span={6}>
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        Loại đối tượng:
                      </Text>
                      <Badge variant="light" color="blue" size="lg">
                        {formData.type}
                      </Badge>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        Mã định danh:
                      </Text>
                      <Text size="sm" fw={600}>
                        {formData.code}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        Tên đối tượng:
                      </Text>
                      <Text size="sm" fw={700}>
                        {formData.name}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        Thương hiệu:
                      </Text>
                      <Text size="sm">{formData.brand || "---"}</Text>
                    </Group>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Stack gap="xs">
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        Người đại diện:
                      </Text>
                      <Text size="sm" fw={500}>
                        {formData.representative || "---"}
                      </Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        Số điện thoại:
                      </Text>
                      <Text size="sm">{formData.phone}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        Email:
                      </Text>
                      <Text size="sm">{formData.email}</Text>
                    </Group>
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed">
                        Phân loại:
                      </Text>
                      <Badge color="orange" variant="outline">
                        {selectedCategory.toUpperCase()}
                      </Badge>
                    </Group>
                  </Stack>
                </Grid.Col>
                <Grid.Col span={12}>
                  <Divider
                    my="xs"
                    label="Địa chỉ & Thuế"
                    labelPosition="center"
                  />
                  <Stack gap="xs">
                    <Group>
                      <IconMapPin size={16} color="gray" />
                      <Text size="sm">
                        <b>Địa chỉ chính:</b> {formData.address}
                      </Text>
                    </Group>
                    <Group>
                      <IconId size={16} color="gray" />
                      <Text size="sm">
                        <b>Mã số thuế:</b> {formData.taxCode} - <b>ĐC Thuế:</b>{" "}
                        {formData.taxAddress}
                      </Text>
                    </Group>
                    {formData.note && (
                      <Group align="flex-start">
                        <IconNote
                          size={16}
                          color="gray"
                          style={{ marginTop: 4 }}
                        />
                        <Text size="sm" c="dimmed">
                          <i>Ghi chú: {formData.note}</i>
                        </Text>
                      </Group>
                    )}
                  </Stack>
                </Grid.Col>
              </Grid>
            </Card>

            {/* 2. CHI NHÁNH & NGÂN HÀNG (2 Cột) */}
            <Grid>
              <Grid.Col span={6}>
                <Card withBorder radius="md" shadow="sm" h="100%">
                  <Title order={5} mb="md" c="teal">
                    🏢 Chi nhánh ({branches.length})
                  </Title>
                  {branches.length > 0 ? (
                    <Stack gap="sm">
                      {branches.map((b, i) => (
                        <Paper key={i} withBorder p="xs" bg="gray.0">
                          <Text size="sm" fw={600}>
                            {b.name}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {b.address}
                          </Text>
                          <Text size="xs">SĐT: {b.phone || "---"}</Text>
                        </Paper>
                      ))}
                    </Stack>
                  ) : (
                    <Text size="sm" c="dimmed" fs="italic">
                      Chưa có chi nhánh
                    </Text>
                  )}
                </Card>
              </Grid.Col>

              <Grid.Col span={6}>
                <Card withBorder radius="md" shadow="sm" h="100%">
                  <Title order={5} mb="md" c="indigo">
                    🏦 Tài khoản ngân hàng ({banks.length})
                  </Title>
                  {banks.length > 0 && banks[0].bank ? (
                    <Stack gap="sm">
                      {banks.map((b, i) => (
                        <Paper key={i} withBorder p="xs" bg="gray.0">
                          <Group justify="space-between">
                            <Text size="sm" fw={600}>
                              {b.bank}
                            </Text>
                            <Badge size="sm" variant="light">
                              {b.accountNumber}
                            </Badge>
                          </Group>
                          <Text size="xs" c="dimmed">
                            Chủ TK: {b.accountHolder}
                          </Text>
                          <Text size="xs">CN: {b.branch}</Text>
                        </Paper>
                      ))}
                    </Stack>
                  ) : (
                    <Text size="sm" c="dimmed" fs="italic">
                      Chưa có thông tin ngân hàng
                    </Text>
                  )}
                </Card>
              </Grid.Col>
            </Grid>

            {/* 3. LIÊN HỆ */}
            <Card withBorder radius="md" shadow="sm">
              <Title order={5} mb="md" c="grape">
                📞 Người liên hệ ({contacts.length})
              </Title>
              {contacts.length > 0 && contacts[0].name ? (
                <Grid>
                  {contacts.map((c, i) => (
                    <Grid.Col span={4} key={i}>
                      <Paper withBorder p="sm" radius="md">
                        <Group gap="xs" mb={4}>
                          <IconUser size={16} />
                          <Text size="sm" fw={600}>
                            {c.name}
                          </Text>
                        </Group>
                        <Text size="xs" c="dimmed" mb={4}>
                          {c.role} - {c.organization}
                        </Text>
                        <Group gap="xs">
                          <IconPhone size={14} color="gray" />
                          <Text size="xs">{c.phone}</Text>
                        </Group>
                        <Group gap="xs">
                          <IconMail size={14} color="gray" />
                          <Text size="xs">{c.email}</Text>
                        </Group>
                      </Paper>
                    </Grid.Col>
                  ))}
                </Grid>
              ) : (
                <Text size="sm" c="dimmed" fs="italic">
                  Chưa có thông tin người liên hệ
                </Text>
              )}
            </Card>
          </Stack>
        </Stepper.Step>

        {/* --- HOÀN THÀNH --- */}
        <Stepper.Completed>
          <Stack align="center" justify="center" mt="xl">
            <Image
              src={"https://cdn-icons-png.flaticon.com/512/148/148767.png"}
              w={150}
              fit="cover"
            />
            <Text fz={"h2"} ta="center">
              Tạo mới thành công!
            </Text>
            <Text fz={"md"} ta="center" c="dimmed">
              Doanh nghiệp {formData.name} đã được lưu vào hệ thống.
            </Text>
            <Button
              size="md"
              mt="md"
              radius={4}
              onClick={() => navigate("/company")}
            >
              Quay về danh sách
            </Button>
          </Stack>
        </Stepper.Completed>
      </Stepper>

      {/* --- NÚT ĐIỀU HƯỚNG --- */}
      {active < 5 && (
        <Group justify="space-between" mt="xl">
          <Button
            variant="default"
            radius={4}
            onClick={prevStep}
            disabled={active === 0}
          >
            Quay lại
          </Button>
          {active === 4 ? (
            <Button
              radius={4}
              color="green"
              onClick={handleConfirmSave}
              loading={isLoading}
            >
              Xác nhận & Lưu
            </Button>
          ) : (
            <Button radius={4} onClick={nextStep}>
              Tiếp theo
            </Button>
          )}
        </Group>
      )}

      {/* Modal Address */}
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
            placeholder="Nhập ghi chú"
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
};

export default CompanyAddPage;
