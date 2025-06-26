import {
  ActionIcon,
  Button,
  Group,
  Paper,
  ScrollAreaAutosize,
  Stack,
  Text,
  TextInput,
  Transition,
} from "@mantine/core";
import { IconArrowRight, IconReload, IconSend } from "@tabler/icons-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { PATH } from "../../constants/path.constants";
import { useNavigate } from "react-router-dom";
type TOption = {
  label: string;
  value: string;
  functions?: TOption[];
  children?: { label: string; value: string; functions?: TOption[] }[];
};
const TREES = [
  {
    label: "Cây Sầu Riêng Monthong",
    value: "A01-01-01-MT",
  },
  {
    label: "Cây Sầu Riêng Ri6",
    value: "A01-01-02-RI6",
  },
  {
    label: "Cây Mít Thái",
    value: "A01-02-01-MT",
  },
  {
    label: "Cây Xoài Cát Chu",
    value: "A01-03-01-XC",
  },
];
const TREE_FUNCTIONS: TOption[] = [
  {
    label: "Tìm kiếm",
    value: "search",
  },
  {
    label: "Tạo mới",
    value: "create",
  },
  {
    label: "Sửa",
    value: "edit",
  },
  {
    label: "Xoá",
    value: "delete",
  },
];
const OPTIONS: TOption[] = [
  {
    label: "Trang chủ",
    value: "home",
  },
  {
    label: "Lịch trình",
    value: "schedule",
  },
  {
    label: "Quản lý vườn cây",
    value: "garden-management",
    functions: TREE_FUNCTIONS,
  },
  {
    label: "Quản lý canh tác",
    value: "cultivation-management",
    children: [
      { label: "Kế hoạch canh tác", value: "cultivation-plan" },
      { label: "Công việc theo kế hoạch", value: "planned-tasks" },
      { label: "Công việc phát sinh", value: "unexpected-tasks" },
      { label: "Kế hoạch BATMAN", value: "batman-plan" },
      { label: "Dự báo sản lượng", value: "yield-forecast" },
      { label: "Menu", value: "cultivation-menu" },
    ],
  },
  {
    label: "Biểu mẫu canh tác",
    value: "cultivation-forms",
    children: [
      { label: "Nhật ký canh tác", value: "cultivation-log" },
      {
        label: "Phiếu giao việc theo kế hoạch",
        value: "task-assignment-planned",
      },
      {
        label: "Phiếu giao việc phát sinh",
        value: "task-assignment-unexpected",
      },
      { label: "Phiếu BATMAN", value: "batman-form" },
    ],
  },
  {
    label: "Quản lý kho & Tài sản",
    value: "warehouse-asset-management",
  },
  {
    label: "Mua hàng",
    value: "purchasing",
  },
  {
    label: "Bán hàng",
    value: "sales",
  },
  {
    label: "Tài chính & Kế toán",
    value: "finance-accounting",
  },
];
const flattenOptions = (options: TOption[]) => {
  const flat: { label: string; value: string; functions?: TOption[] }[] = [];
  options.forEach((opt) => {
    flat.push({ label: opt.label, value: opt.value, functions: opt.functions });
    if (opt.children) {
      opt.children.forEach((child) =>
        flat.push({
          label: `→ ${child.label}`,
          value: child.value,
          functions: opt.functions,
        })
      );
    }
  });
  return flat;
};
const removeVietnameseTones = (str: string) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};
type TData = {
  image: string;
  name: string;
  path: string;
};
type TChatbotModal = {
  closeChatbot: () => void;
};
const ChatbotModal = ({ closeChatbot }: TChatbotModal) => {
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState<TOption[]>([]);
  const [functions, setFunctions] = useState<TOption[]>([]);
  const [messages, setMessages] = useState<
    {
      from: string;
      text: string;
      constant?: string;
      data?: TData;
    }[]
  >([{ from: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" }]);
  const [input, setInput] = useState("");
  const viewport = useRef<HTMLDivElement>(null);

  const sendMessage = (
    value: string,
    constant?: string,
    functions?: TOption[]
  ) => {
    if (!input.trim()) return;
    setMessages((prev) => [
      ...prev,
      { from: "user", text: value, constant: constant },
    ]);
    if (functions) {
      setFunctions(functions);
    }
    setMessages((prev) => [
      ...prev,
      { from: "bot", text: "Vui lòng chọn chức năng mong muốn" },
    ]);
    setInput("");
  };
  const sendFuncMessage = (value: string, constant?: string) => {
    setMessages((prev) => [
      ...prev,
      { from: "user", text: value, constant: constant },
    ]);
    setFunctions([]);
    setSearchData(TREES);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "Vui lòng nhập tên cây trồng hoặc mã cây trồng" },
      ]);
    }, 500);
    setInput("");
  };
  const sendDataMessage = (value: string) => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { from: "user", text: value }]);
    setFunctions([]);
    setSearchData(TREES);
    setMessages((prev) => [
      ...prev,
      {
        from: "bot",
        text: "Vui lòng nhấn nút xác nhận để đến cây trồng mong muốn",
        data: {
          image:
            "https://traicayvuongtron.vn/resources/cache/original_xxxxx/WEBSITE%202023/tim%20hieu%20them/blog/kinh%20nghiem%2Cmeo%20vat/trai%20cay/trai%20cay%20nuoc%20ngoai/sauriengmonthong/monthong2.png.webp",
          name: value,
          path: PATH.GARDEN_MANAGEMENT_AREA_DETAIL,
        },
      },
    ]);
    setInput("");
  };
  const filteredOptions = useMemo(() => {
    const keyword = removeVietnameseTones(input.toLowerCase().trim());
    if (!keyword) return [];
    return flattenOptions(OPTIONS).filter((opt) =>
      removeVietnameseTones(opt.label.toLowerCase()).includes(keyword)
    );
  }, [input]);
  const filteredSearchOptions = useMemo(() => {
    const keyword = removeVietnameseTones(input.toLowerCase().trim());
    if (!keyword) return [];
    return flattenOptions(searchData).filter((opt) =>
      removeVietnameseTones(opt.label.toLowerCase()).includes(keyword)
    );
  }, [input, searchData]);
  useEffect(() => {
    viewport.current?.scrollTo({
      top: viewport.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);
  console.log(messages);
  return (
    <Stack
      h={600}
      justify="space-between"
      style={{ animation: "fadeInUp 0.4s ease" }}
    >
      {/* Chat messages area */}
      <ScrollAreaAutosize
        p="sm"
        h={"100%"}
        offsetScrollbars
        scrollbarSize={6}
        viewportRef={viewport}
      >
        <Stack>
          {(messages.length > 2 ? messages.slice(-2) : messages).map(
            (msg, idx) => (
              <Transition
                key={idx}
                mounted
                transition="fade"
                duration={300}
                timingFunction="ease"
              >
                {(styles) => (
                  <Stack>
                    <Paper
                      p="sm"
                      radius="md"
                      shadow="xs"
                      withBorder
                      bg={msg.from === "user" ? "blue.1" : "gray.1"}
                      style={{
                        alignSelf:
                          msg.from === "user" ? "flex-end" : "flex-start",
                        maxWidth: "75%",
                        ...styles,
                      }}
                    >
                      <Text size="sm">{msg.text}</Text>
                    </Paper>

                    {msg.data && (
                      <Paper
                        shadow="sm"
                        radius="md"
                        withBorder
                        p="xs"
                        style={{
                          backgroundColor: "#f0f0f0",
                          maxWidth: 280,
                          alignSelf: "flex-start",
                        }}
                      >
                        <Stack gap="xs">
                          <img
                            src={msg.data.image}
                            alt={msg.data.name}
                            style={{
                              width: "100%",
                              borderRadius: 8,
                              objectFit: "cover",
                            }}
                          />
                          <Text fw={600} size="sm">
                            {msg.data.name}
                          </Text>
                          <Button
                            component="a"
                            variant="light"
                            color="teal"
                            size="xs"
                            fullWidth
                            onClick={() => {
                              closeChatbot();
                              navigate(msg.data?.path || "");
                            }}
                          >
                            <Group gap={5}>
                              <Text>Đến trang</Text>
                              <IconArrowRight size={18} />
                            </Group>
                          </Button>
                        </Stack>
                      </Paper>
                    )}
                  </Stack>
                )}
              </Transition>
            )
          )}
        </Stack>
      </ScrollAreaAutosize>
      {filteredOptions.length > 0 && searchData.length === 0 && (
        <Transition
          mounted
          transition="pop-top-left"
          duration={250}
          timingFunction="ease"
        >
          {(styles) => (
            <ScrollAreaAutosize style={styles}>
              <Group wrap="nowrap" align="center" py={"xs"} px={"xs"}>
                {filteredOptions.map((option) => (
                  <Button
                    key={option.value}
                    size="xs"
                    variant="light"
                    color="green"
                    onClick={() => {
                      sendMessage(option.label, option.value, option.functions);
                    }}
                    style={{ transition: "transform 0.2s", marginBottom: 4 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </Group>
            </ScrollAreaAutosize>
          )}
        </Transition>
      )}

      {functions?.length > 0 && (
        <Transition
          mounted
          transition="pop-top-left"
          duration={250}
          timingFunction="ease"
        >
          {(styles) => (
            <ScrollAreaAutosize style={styles}>
              <Group wrap="nowrap" align="center" py={"xs"} px={"xs"}>
                {functions.map((option) => (
                  <Button
                    key={option.value}
                    size="xs"
                    variant="light"
                    color="green"
                    onClick={() => {
                      sendFuncMessage(option.label, option.value);
                    }}
                    style={{ transition: "transform 0.2s", marginBottom: 4 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </Group>
            </ScrollAreaAutosize>
          )}
        </Transition>
      )}
      {filteredSearchOptions?.length > 0 && (
        <Transition
          mounted
          transition="pop-top-left"
          duration={250}
          timingFunction="ease"
        >
          {(styles) => (
            <ScrollAreaAutosize style={styles}>
              <Group wrap="nowrap" align="center" py={"xs"} px={"xs"}>
                {filteredSearchOptions.map((option) => (
                  <Button
                    key={option.value}
                    size="xs"
                    variant="light"
                    color="green"
                    onClick={() => {
                      sendDataMessage(`${option.label} - ${option.value}`);
                    }}
                    style={{ transition: "transform 0.2s", marginBottom: 4 }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  >
                    {option.label} - {option.value}
                  </Button>
                ))}
              </Group>
            </ScrollAreaAutosize>
          )}
        </Transition>
      )}
      <Group gap={5}>
        <TextInput
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          style={{ flex: 1 }}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage(input);
          }}
        />
        <ActionIcon
          size={36}
          variant="outline"
          color="teal"
          onClick={() => {
            setMessages([
              { from: "bot", text: "Xin chào! Tôi có thể giúp gì cho bạn?" },
            ]);
            setInput("");
            setFunctions([]);
            setSearchData([]);
          }}
        >
          <IconReload size={24} />
        </ActionIcon>
        <ActionIcon size={36} variant="filled" color="teal">
          <IconSend size={24} />
        </ActionIcon>
      </Group>
    </Stack>
  );
};
export default ChatbotModal;
