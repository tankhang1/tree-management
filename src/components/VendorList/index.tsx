import {
  Card,
  Text,
  Group,
  Stack,
  Badge,
  Tooltip,
  ActionIcon,
  TextInput, // Đổi sang TextInput để làm ô tìm kiếm
  Loader,
  Center,
} from "@mantine/core";
import {
  IconBuildingFactory,
  IconUser,
  IconPhone,
  IconMail,
  IconMapPin,
  IconIdBadge,
  IconSearch,
} from "@tabler/icons-react";
import Scrollable from "../Scrollable";
import { useEffect, useState, useMemo } from "react";
import { useCompanyStore } from "../../pages/zustand/companyStore";

type TVendorList = {
  // Thay đổi: Nhận value từ parent để hiển thị trạng thái đã chọn (nếu form đang edit)
  value?: string;
  onChange: (id: string) => void;
};

export function VendorList({ value, onChange }: TVendorList) {
  // 1. KẾT NỐI STORE
  const { companies, isLoading } = useCompanyStore();

  // 2. STATE LOCAL
  const [selected, setSelected] = useState(value || "");
  const [keyword, setKeyword] = useState("");

  // Sync prop value với state nội bộ (cho trường hợp Edit mode)
  useEffect(() => {
    if (value) setSelected(value);
  }, [value]);

  // 4. LỌC DANH SÁCH (Chỉ lấy Nhà cung cấp + Logic tìm kiếm)
  const filteredSuppliers = useMemo(() => {
    return companies.filter((c) => {
      // Điều kiện 1: Phải là Nhà cung cấp
      const isSupplier = c.categoryType === "supplier";

      // Điều kiện 2: Tìm kiếm theo tên hoặc mã
      const matchKeyword =
        !keyword ||
        c.name.toLowerCase().includes(keyword.toLowerCase()) ||
        c.code.toLowerCase().includes(keyword.toLowerCase());

      return isSupplier && matchKeyword;
    });
  }, [companies, keyword]);

  const onSelect = (id: string) => {
    setSelected(id);
    onChange(id); // Trả về ID cho form cha
  };

  return (
    <Stack gap={"xs"}>
      <Text fw={500} fz={15}>
        Chọn nhà cung cấp
      </Text>

      {/* Ô tìm kiếm */}
      <TextInput
        placeholder="Tìm kiếm theo tên hoặc mã..."
        leftSection={<IconSearch size={18} />}
        radius={4}
        value={keyword}
        onChange={(e) => setKeyword(e.currentTarget.value)}
      />

      <Scrollable h={270}>
        {isLoading ? (
          <Center h={200}>
            <Loader size="sm" />
          </Center>
        ) : filteredSuppliers.length === 0 ? (
          <Center h={200}>
            <Text c="dimmed" size="sm">
              Không tìm thấy nhà cung cấp nào.
            </Text>
          </Center>
        ) : (
          <Group wrap="nowrap" gap="md" p={"xs"}>
            {filteredSuppliers.map((sup) => (
              <Card
                miw={400}
                h={250}
                key={sup.id}
                shadow="md"
                padding="lg"
                radius="md"
                withBorder
                style={{
                  position: "relative",
                  transition: "transform 0.2s ease",
                  // So sánh theo ID
                  borderColor: selected === sup.id ? "green" : undefined,
                  borderWidth: selected === sup.id ? 2 : 1,
                  cursor: "pointer",
                }}
                onClick={() => onSelect(sup.id)}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <Group justify="space-between">
                  <Group>
                    <IconBuildingFactory
                      size={32}
                      color={selected === sup.id ? "green" : "gray"}
                    />
                    <div>
                      <Text size="lg" fw={700} lineClamp={1} title={sup.name}>
                        {sup.name}
                      </Text>
                      <Badge
                        color={sup.type === "Doanh nghiệp" ? "blue" : "orange"}
                        variant="light"
                        mt={4}
                      >
                        {sup.type}
                      </Badge>
                    </div>
                  </Group>

                  <Tooltip label="Xem chi tiết" withArrow>
                    <ActionIcon
                      color="blue"
                      variant="light"
                      radius="xl"
                      size="lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Logic xem chi tiết nếu cần
                      }}
                    >
                      <IconIdBadge size={20} />
                    </ActionIcon>
                  </Tooltip>
                </Group>

                <Stack mt="md" gap="xs">
                  <Group>
                    <IconIdBadge size={18} />
                    <Text size="sm">
                      <strong>Mã:</strong> {sup.code}
                    </Text>
                  </Group>

                  <Group>
                    <IconUser size={18} />
                    <Text size="sm" lineClamp={1}>
                      <strong>Đại diện:</strong> {sup.representative}
                    </Text>
                  </Group>

                  <Group>
                    <IconPhone size={18} />
                    <Text size="sm">
                      <strong>SĐT:</strong> {sup.phone}
                    </Text>
                  </Group>

                  {sup.email && (
                    <Group>
                      <IconMail size={18} />
                      <Text size="sm" lineClamp={1}>
                        <strong>Email:</strong> {sup.email}
                      </Text>
                    </Group>
                  )}

                  <Group align="start">
                    <IconMapPin size={18} style={{ marginTop: 2 }} />
                    <Text size="sm" lineClamp={1} title={sup.address}>
                      <strong>ĐC:</strong> {sup.address}
                    </Text>
                  </Group>
                </Stack>

                {/* Dấu check xanh khi được chọn */}
                {selected === sup.id && (
                  <Badge
                    color="green"
                    variant="filled"
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      zIndex: 10,
                    }}
                  >
                    Đang chọn
                  </Badge>
                )}
              </Card>
            ))}
          </Group>
        )}
      </Scrollable>
    </Stack>
  );
}
