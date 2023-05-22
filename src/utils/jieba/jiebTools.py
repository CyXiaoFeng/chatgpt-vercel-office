#encoding=utf-8
import sys
sys.path.append("../")
import jieba


def cuttest(test_sent):
    result = jieba.lcut_for_search(test_sent,)
    print(" / ".join(result))


if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("请传入参数")
        sys.exit()
    
content = sys.argv[1]
cuttest(content)