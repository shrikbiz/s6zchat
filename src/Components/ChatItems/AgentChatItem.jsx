import GradientText from "@components/Animations/GradientText";
import MarkdownRenderer from "@components/MarkdownRenderer";
import "./AgentChatItem.css";

export default function AgentChatItem({ chatItem }) {
    return chatItem.isLoading ? (
        <GradientText
            colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
            animationSpeed={3}
            showBorder={false}
            className="custom-class"
        >
            <h3 className="agent-chat-thinking-text">Thinking</h3>
        </GradientText>
    ) : (
        <MarkdownRenderer markdown={chatItem.content} />
    );
}
