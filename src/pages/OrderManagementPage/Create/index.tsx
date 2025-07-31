import {
  Card,
  Stack,
  TextInput,
  NumberInput,
  Select,
  Button,
  Group,
  Title,
  Divider,
  Stepper,
  Text,
  Input,
  Image,
  ScrollAreaAutosize,
  Badge,
  RadioGroup,
  Radio,
} from "@mantine/core";
import { useState } from "react";
import {
  IconBox,
  IconBuildingStore,
  IconHeartHandshake,
  IconPlus,
  IconSearch,
  IconTools,
  IconUser,
} from "@tabler/icons-react";
import { SelectableSupplierCards } from "../../SupplyManagementPage/Add/components/SelectableSupplierCards";
const bankList = [
  {
    id: "VCB",
    bankName: "Vietcombank",
    accountName: "Nguyễn Văn A",
    accountNumber: "0123456789",
    logo: "data:image/jpeg;base64,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",
  },
  {
    id: "ACB",
    bankName: "ACB",
    accountName: "Trần Thị B",
    accountNumber: "9876543210",
    logo: "https://upload.wikimedia.org/wikipedia/commons/d/d9/Asia_Commercial_Bank_logo.svg",
  },
  {
    id: "TPB",
    bankName: "TPBank",
    accountName: "Lê Văn C",
    accountNumber: "1234567890",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTL9Cpp1nDLbzIrK_-ljQsqJOGbytIiiDAgmQ&s",
  },
];
const productList = [
  {
    productCode: "SP001",
    productName: "Mứt sầu riêng Ri6",
    tree: "Sầu riêng",
    category: "Thực phẩm chế biến",
    description: "Sản phẩm được làm từ sầu riêng Ri6, đóng gói 250g.",
    img: "https://mutngon.com/upload/images/sau-rieng-monthong-nguyen-mui-say-thang-hoa-gion-don-mut-ngon-nafarm.jpg",
  },
  {
    productCode: "SP002",
    productName: "Cafe hạt nguyên chất",
    tree: "Cà phê",
    category: "Đồ uống",
    description: "Cafe Arabica thu hoạch tại Đắk Lắk, rang mộc.",
    img: "https://caphenguyenchat.net/wp-content/uploads/2021/06/ca-phe-nguyen-chat-co-tac-dung-gi-01.jpg",
  },
  {
    productCode: "SP003",
    productName: "Chuối sấy dẻo",
    tree: "Chuối",
    category: "Thực phẩm sấy",
    description: "Chuối sấy dẻo đóng gói 100g, không chất bảo quản.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwfg09hQiiHhgWNJZx_wrQAu-SWPqTz0yfAw&s",
  },
];
const materialList = [
  {
    materialCode: "MAT001",
    materialName: "Phân NPK",
    description: "Phân NPK 16-16-8, dùng để bón cây trồng.",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR13HYMgDcPhnAzZ6lY8iTNwApj5XWCanAClQ&s",
  },
  {
    materialCode: "MAT002",
    materialName: "Phân hữu cơ",
    description: "Phân hữu cơ vi sinh, cải tạo đất.",

    img: "https://glawvn.com/wp-content/uploads/2023/04/phan-huu-co-la-gi-cac-loai-phan-huu-co-hien-hanh.jpeg",
  },
  {
    materialCode: "MAT003",
    materialName: "Hạt giống lúa",
    description: "Hạt giống lúa chất lượng cao, năng suất tốt.",
    img: "https://dantocmiennui-media.baotintuc.vn/images/c9bca312d68a4cb9c6013396197925b3d1b8e36a1725d1ac6318a949e7a3f3e724dfb1e5a06e02d6e56da454907910f8c375e3c3907454255baf9e67f8135c667a2f0b35f3ac576d14e6307ca755e480/cach-de-hat-lua-gong-nay-mam-deu-500x375-1.jpg.webp",
  },
];
const s = {
  id: "sup-1",
  name: "Công ty TNHH Nông Nghiệp Xanh",
  type: "Doanh nghiệp",
  representative: "Nguyễn Văn A",
  phone: "0912345678",
  email: "contact@nongnghiepxanh.vn",
  address: "123 Đường Lê Lợi, Quận 1, TP.HCM",
  taxCode: "0312345678",
  sectors: ["Phân bón", "Thuốc BVTV"],
  note: "Đối tác lâu năm",
};
export const addressList = [
  {
    id: "ADDR001",
    recipientName: "Nguyễn Văn A",
    phoneNumber: "0123456789",
    address: "123 Đường Lê Lợi, Phường Bến Nghé, Quận 1, TP.HCM",
  },
  {
    id: "ADDR002",
    recipientName: "Trần Thị B",
    phoneNumber: "0987654321",
    address: "456 Đường Nguyễn Huệ, Phường Bến Thành, Quận 1, TP.HCM",
  },
  {
    id: "ADDR003",
    recipientName: "Lê Văn C",
    phoneNumber: "0912345678",
    address: "789 Đường Hai Bà Trưng, Phường Đa Kao, Quận 1, TP.HCM",
  },
];
const types = [
  {
    id: "T001",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlYBaKOa_i9kDFe7NcpVlO5ymNmreB977Wug&s",
    name: "Sầu riêng đông lạnh",
    note: "Sầu riêng đông lạnh là sản phẩm chế biến từ sầu riêng tươi, giữ nguyên hương vị và chất lượng.",
  },

  {
    id: "T003",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlYBaKOa_i9kDFe7NcpVlO5ymNmreB977Wug&s",
    name: "Sầu riêng khay",
    note: "Sầu riêng là loại cây ăn quả nhiệt đới.",
  },
];

const OrderManagementCreatePage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    orderId: "ORD001",
    orderName: "Đơn hàng phân bón NPK",
    customerType: "customer", // "customer", "supplier", or "partner"
    taxCode: "123456789",
    products: ["product1", "product2"],
    invoiceId: "INV001",
    totalAmount: 5000000,
    discountAmount: 500000,
    paymentAmount: 4500000,
    bankInfo: "Ngân hàng A",
    category: "",
    bomType: "Sản phẩm", // "Sản phẩm" or "Nguyên Vật Liệu"
    method: "cash", // "cash" or "bank_transfer"
  });

  const handleNextStep = () => {
    if (activeStep < 3) setActiveStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    if (activeStep > 0) setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = () => {
    console.log("Đơn hàng mới:", formData);
  };

  return (
    <Card withBorder shadow="sm" p="lg" radius={4}>
      <Stack>
        <Title order={3}>Tạo đơn hàng</Title>

        <Stepper active={activeStep} onStepClick={setActiveStep}>
          {/* Step 1: Thông tin cơ bản */}
          <Stepper.Step label="Bước 1" description="Nhập thông tin đơn hàng">
            <Stack gap="md">
              <TextInput
                label="Mã đơn hàng"
                placeholder="Nhập mã đơn hàng"
                value={formData.orderId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    orderId: e.currentTarget.value,
                  }))
                }
                radius={4}
                withAsterisk
              />
              <TextInput
                label="Tên đơn hàng"
                placeholder="Nhập tên đơn hàng"
                value={formData.orderName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    orderName: e.currentTarget.value,
                  }))
                }
                radius={4}
                withAsterisk
              />

              <Input.Wrapper label="Đối tượng">
                <Group gap="md">
                  <Button
                    variant={
                      formData.customerType === "customer"
                        ? "filled"
                        : "outline"
                    }
                    leftSection={<IconUser size={18} />}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        customerType: "customer",
                      }))
                    }
                    radius={4}
                  >
                    Khách hàng
                  </Button>
                  <Button
                    variant={
                      formData.customerType === "supplier"
                        ? "filled"
                        : "outline"
                    }
                    leftSection={<IconBuildingStore size={18} />}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        customerType: "supplier",
                      }))
                    }
                    radius={4}
                  >
                    Nhà cung cấp
                  </Button>
                  <Button
                    variant={
                      formData.customerType === "partner" ? "filled" : "outline"
                    }
                    leftSection={<IconHeartHandshake size={18} />}
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        customerType: "partner",
                      }))
                    }
                    radius={4}
                  >
                    Đối tác
                  </Button>
                </Group>
              </Input.Wrapper>
              <TextInput
                label={`${
                  formData.customerType === "customer"
                    ? "Chọn khách hàng"
                    : formData.customerType === "partner"
                    ? "Chọn đối tác"
                    : "Chọn nhà cung cấp"
                } (chọn một)`}
                radius={4}
                placeholder="Chọn nhà cung cấp"
              />
              <SelectableSupplierCards isCheckbox={false} />
            </Stack>
          </Stepper.Step>

          {/* Step 2: Thông tin sản phẩm */}
          <Stepper.Step label="Bước 2" description="Chọn sản phẩm và số lượng">
            <Group align="flex-start">
              <Card flex={1} withBorder shadow="sm" radius={4} p="lg">
                <Stack gap="md">
                  <Title order={5} fw={500}>
                    Tìm kiếm sản phẩm / nguyên vật liệu
                  </Title>
                  <Group>
                    {["Sản phẩm", "Nguyên Vật Liệu"].map((group) => (
                      <Button
                        key={group}
                        variant={
                          formData.bomType === group ? "filled" : "light"
                        }
                        radius={4}
                        onClick={() =>
                          setFormData({ ...formData, bomType: group })
                        }
                        leftSection={
                          group === "Sản phẩm" ? (
                            <IconBox size={18} />
                          ) : (
                            <IconTools size={18} />
                          )
                        }
                      >
                        {group}
                      </Button>
                    ))}
                  </Group>
                  {formData.bomType === "Sản phẩm" ? (
                    <Stack gap={"xs"}>
                      <TextInput
                        placeholder="Danh mục sản phẩm"
                        label="Danh mục sản phẩm"
                        leftSection={<IconSearch size={18} />}
                        radius={4}
                      />
                      <Group gap="md" wrap="wrap">
                        {types.map((category, index) => (
                          <Card
                            h={200}
                            key={index}
                            withBorder
                            shadow="sm"
                            radius="md"
                            style={{
                              width: "150px",
                              cursor: "pointer",
                              borderColor:
                                formData.category === category.name
                                  ? "green"
                                  : "#d9d9d9",
                            }}
                            onClick={() =>
                              setFormData({
                                ...formData,
                                category: category.name,
                              })
                            }
                          >
                            <Stack align="center" justify="center" gap="xs">
                              <Image src={category.img} h={100} />
                              <Text ta="center" fw={500}>
                                {category.name}
                              </Text>
                            </Stack>
                          </Card>
                        ))}
                      </Group>
                    </Stack>
                  ) : (
                    <Select
                      label="Danh mục nguyên vật liệu"
                      placeholder="Danh mục nguyên vật liệu"
                      radius={4}
                      data={[
                        { value: "fertilizer", label: "Phân bón" },
                        { value: "seeds", label: "Hạt giống" },
                        { value: "tools", label: "Dụng cụ nông nghiệp" },
                        { value: "organic", label: "Phân hữu cơ" },
                        { value: "chemicals", label: "Hóa chất nông nghiệp" },
                      ]}
                    />
                  )}

                  {formData.bomType === "Sản phẩm" && (
                    <Stack gap={"xs"}>
                      <TextInput
                        placeholder="Sản phẩm"
                        label="Sản phẩm"
                        leftSection={<IconSearch size={18} />}
                        radius={4}
                      />
                      <Group gap="md">
                        {productList.map((product, index) => (
                          <Card
                            w={300}
                            h={350}
                            key={index}
                            withBorder
                            shadow="sm"
                            radius="md"
                            p="md"
                          >
                            <Stack>
                              <Image
                                src={product.img}
                                alt={product.productName}
                                height={150}
                                radius="md"
                              />
                              <Text>
                                <b>Mã sản phẩm:</b> {product.productCode}
                              </Text>
                              <Text>
                                <b>Tên sản phẩm:</b> {product.productName}
                              </Text>

                              <Text>
                                <b>Danh mục:</b> {product.category}
                              </Text>
                            </Stack>
                          </Card>
                        ))}
                      </Group>
                    </Stack>
                  )}
                  {formData.bomType === "Nguyên Vật Liệu" && (
                    <Stack gap={"xs"}>
                      <TextInput
                        placeholder="Nguyên vật liệu"
                        label="Nguyên vật liệu"
                        leftSection={<IconSearch size={18} />}
                        radius={4}
                      />
                      <Group gap="md" wrap="nowrap">
                        {materialList.map((material, index) => (
                          <Card
                            w={300}
                            h={350}
                            key={index}
                            withBorder
                            shadow="sm"
                            radius="md"
                            p="md"
                          >
                            <Stack>
                              <Image
                                src={material.img}
                                alt={material.materialName}
                                h={150}
                                radius="md"
                              />
                              <Text>
                                <b>Mã nguyên vật liệu:</b>{" "}
                                {material.materialCode}
                              </Text>
                              <Text>
                                <b>Tên nguyên vật liệu:</b>{" "}
                                {material.materialName}
                              </Text>

                              <Text>
                                <b>Mô tả:</b> {material.description}
                              </Text>
                            </Stack>
                          </Card>
                        ))}
                      </Group>
                    </Stack>
                  )}

                  <Button
                    variant="light"
                    leftSection={<IconPlus size={18} />}
                    onClick={() => {
                      // Logic to add product/material to the list
                      console.log("Thêm sản phẩm/Nguyên vật liệu đã chọn");
                    }}
                    radius={4}
                  >
                    Thêm sản phẩm/Nguyên vật liệu
                  </Button>
                </Stack>
              </Card>
              <Card w={"40%"} withBorder shadow="sm" radius={4} p="lg">
                <Stack gap={"xs"}>
                  <Title order={5} fw={500}>
                    Danh sách sản phẩm / nguyên vật liệu đã chọn
                  </Title>
                  <Stack mah={900}>
                    <ScrollAreaAutosize>
                      <Stack gap={"xs"}>
                        {productList.map((product, index) => (
                          <Card
                            w={"100%"}
                            key={index}
                            withBorder
                            shadow="sm"
                            radius="md"
                            p="md"
                          >
                            <Group>
                              <Image
                                w={200}
                                src={product.img}
                                fit="contain"
                                alt={product.productName}
                                radius="md"
                              />
                              <Stack gap={"xs"} flex={1}>
                                <Text>
                                  <b>Mã sản phẩm:</b> {product.productCode}
                                </Text>
                                <Text>
                                  <b>Tên sản phẩm:</b> {product.productName}
                                </Text>

                                <Text>
                                  <b>Danh mục:</b> {product.category}
                                </Text>
                                <Group grow>
                                  <NumberInput label="Đơn giá" radius={4} />
                                  <NumberInput label="Số lượng" radius={4} />
                                  <Select
                                    label="Đơn vị"
                                    radius={4}
                                    data={[
                                      { value: "kg", label: "Kilogram" },
                                      { value: "g", label: "Gram" },
                                      { value: "l", label: "Lít" },
                                      { value: "pcs", label: "Cái" },
                                    ]}
                                  />
                                </Group>
                              </Stack>
                              <Button
                                pos={"absolute"}
                                top={10}
                                right={10}
                                variant="light"
                                color="red"
                                radius={4}
                              >
                                Xoá
                              </Button>
                            </Group>
                          </Card>
                        ))}
                        {materialList.map((material, index) => (
                          <Card
                            w={"100%"}
                            key={index}
                            withBorder
                            shadow="sm"
                            radius="md"
                            p="md"
                          >
                            <Group>
                              <Image
                                src={material.img}
                                alt={material.materialName}
                                w={200}
                                radius="md"
                              />
                              <Stack flex={1} gap={"xs"}>
                                <Text>
                                  <b>Mã nguyên vật liệu:</b>{" "}
                                  {material.materialCode}
                                </Text>
                                <Text>
                                  <b>Tên nguyên vật liệu:</b>{" "}
                                  {material.materialName}
                                </Text>

                                <Text>
                                  <b>Mô tả:</b> {material.description}
                                </Text>
                                <Group grow>
                                  <NumberInput label="Đơn giá" radius={4} />
                                  <NumberInput label="Số lượng" radius={4} />
                                  <Select
                                    label="Quy cách"
                                    radius={4}
                                    data={[
                                      {
                                        value: "PKG001",
                                        label: "Hộp giấy nhỏ (50 cái)",
                                      },
                                      {
                                        value: "PKG002",
                                        label: "Túi nilon lớn (100 cái)",
                                      },
                                      {
                                        value: "PKG003",
                                        label: "Bao tải 25kg (25 cái)",
                                      },
                                      {
                                        value: "PKG004",
                                        label: "Bịch nhựa 1kg (10 cái)",
                                      },
                                      {
                                        value: "PKG005",
                                        label: "Thùng carton lớn (20 cái)",
                                      },
                                      {
                                        value: "PKG006",
                                        label: "Hộp nhựa 500ml (30 cái)",
                                      },
                                    ]}
                                  />
                                </Group>
                                <Button
                                  pos={"absolute"}
                                  top={10}
                                  right={10}
                                  variant="light"
                                  color="red"
                                  radius={4}
                                >
                                  Xoá
                                </Button>
                              </Stack>
                            </Group>
                          </Card>
                        ))}
                      </Stack>
                    </ScrollAreaAutosize>
                  </Stack>
                </Stack>
              </Card>
            </Group>
          </Stepper.Step>

          {/* Step 3: Thông tin hóa đơn */}
          <Stepper.Step label="Bước 3" description="Nhập thông tin thanh toán">
            <Stack gap="md">
              <Stack>
                <Select
                  label="Hợp đồng liên quan (chọn một)"
                  searchable
                  placeholder="(Tuỳ chọn)"
                  radius={4}
                />
                <Group>
                  <Card shadow="sm" padding="md" radius="md" withBorder>
                    <Group justify="apart" mb="xs">
                      <Title order={5}>
                        HĐMB-001 - Hợp đồng mua bán thiết bị tưới
                      </Title>
                      <Badge color="blue">Hợp đồng mua bán</Badge>
                    </Group>

                    <Text size="sm">
                      <b>Ngày ký:</b> 20/06/2025
                    </Text>
                    <Text size="sm">
                      <b>Bên A:</b> CTY TNHH Thiết bị Nông nghiệp
                    </Text>
                    <Text size="sm">
                      <b>Bên B:</b> Hợp tác xã Rau Sạch Lâm Đồng
                    </Text>
                    <Text size="sm">
                      <b>Loại hợp đồng:</b> Mới
                    </Text>

                    <Divider my="xs" />
                    <Text size="sm" lineClamp={2}>
                      <b>Nội dung:</b> Cung cấp hệ thống tưới tự động và thiết
                      bị điều khiển trung tâm...
                    </Text>

                    <Group mt="md" justify="apart">
                      <Button size="xs" variant="light">
                        Xem chi tiết
                      </Button>
                      <Button size="xs" variant="subtle" color="red">
                        Huỷ
                      </Button>
                    </Group>
                  </Card>
                  <Card shadow="sm" padding="md" radius="md" withBorder>
                    <Group justify="apart" mb="xs">
                      <Title order={5}>
                        HĐMB-001 - Hợp đồng mua bán thiết bị tưới
                      </Title>
                      <Badge color="blue">Hợp đồng mua bán</Badge>
                    </Group>

                    <Text size="sm">
                      <b>Ngày ký:</b> 20/06/2025
                    </Text>
                    <Text size="sm">
                      <b>Bên A:</b> CTY TNHH Thiết bị Nông nghiệp
                    </Text>
                    <Text size="sm">
                      <b>Bên B:</b> Hợp tác xã Rau Sạch Lâm Đồng
                    </Text>
                    <Text size="sm">
                      <b>Loại hợp đồng:</b> Mới
                    </Text>

                    <Divider my="xs" />
                    <Text size="sm" lineClamp={2}>
                      <b>Nội dung:</b> Cung cấp hệ thống tưới tự động và thiết
                      bị điều khiển trung tâm...
                    </Text>

                    <Group mt="md" justify="apart">
                      <Button size="xs" variant="light">
                        Xem chi tiết
                      </Button>
                      <Button size="xs" variant="subtle" color="red">
                        Huỷ
                      </Button>
                    </Group>
                  </Card>
                </Group>
              </Stack>
              <TextInput
                label="Mã hóa đơn"
                placeholder="Nhập mã hóa đơn"
                value={formData.invoiceId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    invoiceId: e.currentTarget.value,
                  }))
                }
                radius={4}
                withAsterisk
              />
              <Group grow>
                <NumberInput
                  thousandSeparator
                  label="Tổng tiền"
                  placeholder="Nhập tổng tiền"
                  value={formData.totalAmount}
                  radius={4}
                  withAsterisk
                />
                <NumberInput
                  thousandSeparator
                  label="Tiền khấu trừ"
                  placeholder="Nhập tiền khấu trừ"
                  value={formData.discountAmount}
                  radius={4}
                />
                <NumberInput
                  thousandSeparator
                  label="Tiền thanh toán"
                  placeholder="Nhập tiền thanh toán"
                  value={formData.paymentAmount}
                  radius={4}
                  withAsterisk
                />
              </Group>
              <RadioGroup
                label="Phương thức thanh toán"
                value={formData.method}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    method: value || "cash",
                  }))
                }
              >
                <Stack>
                  <Radio value="cash" label="Tiền mặt" />
                  <Radio value="bank_transfer" label="Chuyển khoản ngân hàng" />
                </Stack>
              </RadioGroup>
              {formData.method !== "cash" && (
                <Input.Wrapper label="Ngân hàng hưởng thụ (chọn một)">
                  <Group>
                    {bankList.map((bank) => (
                      <Card
                        key={bank.id}
                        withBorder
                        shadow="sm"
                        radius="md"
                        p="lg"
                      >
                        <Group gap="md">
                          <Image src={bank.logo} w={50} h={50} fit="contain" />
                          <Stack gap="xs" flex={1}>
                            <Title order={4} fw={500}>
                              {bank.bankName}
                            </Title>
                            <Text>
                              <b>Chủ tài khoản:</b> {bank.accountName}
                            </Text>
                            <Text>
                              <b>Số tài khoản:</b> {bank.accountNumber}
                            </Text>
                          </Stack>
                        </Group>
                      </Card>
                    ))}
                  </Group>
                </Input.Wrapper>
              )}
              <Input.Wrapper label="Địa chỉ nhận hàng (chọn một)">
                <Group align="flex-start" gap="md">
                  {addressList.map((address) => (
                    <Card
                      key={address.id}
                      w={300}
                      withBorder
                      shadow="sm"
                      radius="md"
                      p="lg"
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
              </Input.Wrapper>
            </Stack>
          </Stepper.Step>

          {/* Step 4: Xác nhận */}
          <Stepper.Step label="Bước 4" description="Xác nhận thông tin">
            <Stack gap="md">
              <Title order={4}>Xác nhận thông tin đơn hàng</Title>
              <Divider />
              <Group grow align="flex-start">
                <Stack gap={"xs"}>
                  <Card withBorder radius="md" p="md">
                    <Group justify="space-between" mb="xs">
                      <Text fw={600}>{s.name}</Text>
                    </Group>
                    <Stack gap={2}>
                      <Text size="sm">
                        <strong>Loại:</strong> {s.type}
                      </Text>
                      <Text size="sm">
                        <strong>Người đại diện:</strong> {s.representative}
                      </Text>
                      <Text size="sm">
                        <strong>SĐT:</strong> {s.phone}
                      </Text>
                      {s.email && (
                        <Text size="sm">
                          <strong>Email:</strong> {s.email}
                        </Text>
                      )}
                      <Text size="sm">
                        <strong>Địa chỉ:</strong> {s.address}
                      </Text>
                      {s.taxCode && (
                        <Text size="sm">
                          <strong>Mã số thuế:</strong> {s.taxCode}
                        </Text>
                      )}
                      <Text size="sm">
                        <strong>Ngành hàng:</strong>{" "}
                        <Group gap={4}>
                          {s.sectors.map((sec) => (
                            <Badge key={sec} variant="light" color="green">
                              {sec}
                            </Badge>
                          ))}
                        </Group>
                      </Text>
                      {s.note && (
                        <Text size="sm" c="dimmed">
                          💬 {s.note}
                        </Text>
                      )}
                    </Stack>
                  </Card>
                  <Card
                    key={bankList[0].id}
                    withBorder
                    shadow="sm"
                    radius="md"
                    p="lg"
                  >
                    <Group gap="md">
                      <Image
                        src={bankList[0].logo}
                        w={50}
                        h={50}
                        fit="contain"
                      />
                      <Stack gap="xs" flex={1}>
                        <Title order={4} fw={500}>
                          {bankList[0].bankName}
                        </Title>
                        <Text>
                          <b>Chủ tài khoản:</b> {bankList[0].accountName}
                        </Text>
                        <Text>
                          <b>Số tài khoản:</b> {bankList[0].accountNumber}
                        </Text>
                      </Stack>
                    </Group>
                  </Card>
                  <Card withBorder shadow="sm" radius="md" p="lg">
                    <Title order={5} fw={500} mb="sm">
                      <IconTools size={18} style={{ marginRight: 8 }} />
                      Thông tin sản phẩm / nguyên vật liệu
                    </Title>
                    <Stack gap="xs">
                      {materialList.map((material, index) => (
                        <Card
                          key={index}
                          withBorder
                          shadow="sm"
                          radius="md"
                          p="md"
                        >
                          <Group>
                            <Image
                              src={material.img}
                              alt={material.materialName}
                              w={150}
                              radius="md"
                            />
                            <Stack gap={4}>
                              <Text>
                                <b>Mã nguyên vật liệu:</b>{" "}
                                {material.materialCode}
                              </Text>
                              <Text>
                                <b>Tên nguyên vật liệu:</b>{" "}
                                {material.materialName}
                              </Text>

                              <Text>
                                <b>Mô tả:</b> {material.description}
                              </Text>
                              <Text>
                                <b>Đơn giá:</b> 33.33.000 đ
                              </Text>
                              <Text>
                                <b>Số lượng (đơn vị):</b> 3kg
                              </Text>
                            </Stack>
                          </Group>
                        </Card>
                      ))}
                    </Stack>
                  </Card>
                </Stack>
                <Stack gap={"xs"}>
                  <Card shadow="sm" padding="md" radius="md" withBorder>
                    <Group justify="apart" mb="xs">
                      <Title order={5}>
                        HĐMB-001 - Hợp đồng mua bán thiết bị tưới
                      </Title>
                      <Badge color="blue">Hợp đồng mua bán</Badge>
                    </Group>

                    <Text size="sm">
                      <b>Ngày ký:</b> 20/06/2025
                    </Text>
                    <Text size="sm">
                      <b>Bên A:</b> CTY TNHH Thiết bị Nông nghiệp
                    </Text>
                    <Text size="sm">
                      <b>Bên B:</b> Hợp tác xã Rau Sạch Lâm Đồng
                    </Text>
                    <Text size="sm">
                      <b>Loại hợp đồng:</b> Mới
                    </Text>

                    <Divider my="xs" />
                    <Text size="sm" lineClamp={2}>
                      <b>Nội dung:</b> Cung cấp hệ thống tưới tự động và thiết
                      bị điều khiển trung tâm...
                    </Text>

                    <Group mt="md" justify="apart">
                      <Button size="xs" variant="light">
                        Xem chi tiết
                      </Button>
                      <Button size="xs" variant="subtle" color="red">
                        Huỷ
                      </Button>
                    </Group>
                  </Card>
                  {/* Thông tin đơn hàng */}
                  <Card withBorder shadow="sm" radius={4} p="lg">
                    <Title order={5} fw={500} mb="sm">
                      <IconBox size={18} style={{ marginRight: 8 }} />
                      Thông tin đơn hàng
                    </Title>
                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Text fw={500}>Mã đơn hàng:</Text>
                        <Text>{formData.orderId}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Tên đơn hàng:</Text>
                        <Text>{formData.orderName}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Đối tượng:</Text>
                        <Text>
                          {formData.customerType === "customer"
                            ? "Khách hàng"
                            : formData.customerType === "supplier"
                            ? "Nhà cung cấp"
                            : "Đối tác"}
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Mã số thuế:</Text>
                        <Text>{formData.taxCode}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Phương thức thanh toán:</Text>
                        <Text>Chuyển khoản ngân hàng</Text>
                      </Group>
                    </Stack>
                  </Card>
                  {/* Thông tin hóa đơn */}
                  <Card withBorder shadow="sm" radius={4} p="lg">
                    <Title order={5} fw={500} mb="sm">
                      <IconBuildingStore size={18} style={{ marginRight: 8 }} />
                      Thông tin hóa đơn
                    </Title>
                    <Stack gap="xs">
                      <Group justify="space-between">
                        <Text fw={500}>Mã hóa đơn:</Text>
                        <Text>{formData.invoiceId}</Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Tổng tiền:</Text>
                        <Text color="blue">
                          {formData.totalAmount.toLocaleString("vi-VN")} đ
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Tiền khấu trừ:</Text>
                        <Text color="blue">
                          {formData.discountAmount.toLocaleString("vi-VN")} đ
                        </Text>
                      </Group>
                      <Group justify="space-between">
                        <Text fw={500}>Tiền thanh toán:</Text>
                        <Text color="green" fw={700}>
                          {formData.paymentAmount.toLocaleString("vi-VN")} đ
                        </Text>
                      </Group>
                    </Stack>
                  </Card>
                </Stack>
              </Group>
            </Stack>
          </Stepper.Step>
        </Stepper>

        <Group justify="space-between" mt="lg">
          <Button radius={4} variant="outline" onClick={handlePrevStep}>
            Quay lại
          </Button>

          {activeStep < 3 ? (
            <Button radius={4} onClick={handleNextStep}>
              Tiếp theo
            </Button>
          ) : (
            <Button radius={4} onClick={handleSubmit}>
              Hoàn tất
            </Button>
          )}
        </Group>
      </Stack>
    </Card>
  );
};

export default OrderManagementCreatePage;
