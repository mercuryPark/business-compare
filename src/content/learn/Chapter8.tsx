import { Callout } from '../../components/learn/primitives/Callout';
import { Caveat } from '../../components/learn/primitives/Caveat';
import { CtaLink } from '../../components/learn/primitives/CtaLink';
import { NumericClaim } from '../../components/learn/primitives/NumericClaim';
import { TermExplainer } from '../../components/learn/primitives/TermExplainer';

const INCOME_TAX_ID = 'ch8-nts-income-tax';

export function Chapter8() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-ink">매출이 잘 나올 때 — 지속과 확장</h2>
        <p className="text-muted">
          잘 되는 가게가 무너지는 이유는 매출 부족이 아니라 잘 될 때의 방심입니다. 잘 벌수록
          세금이 커지고, 통장의 여윳돈을 보고 성급하게 2호점을 내며, 사장님 본인이 번아웃으로
          쓰러집니다. 이 장은 잘 나갈 때 지켜야 할 것들을 정리합니다.
        </p>
      </header>

      <Caveat>
        세금의 정확한 세율·과세표준 구간·공제는 소득 규모와 시점에 따라 달라지며, 이 장은
        구체적 세율이 아니라 <span className="font-semibold">구조와 주의점</span>만 다룹니다. 정확한
        세액과 절세 방법은 국세청 자료와 세무사 확인이 필요합니다.
      </Caveat>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">1. 잘 벌수록 세금을 조심하라</h3>
        <p className="text-sm text-ink">
          매출이 오르면 가장 먼저 같이 커지는 것이 세금입니다. 특히{' '}
          <TermExplainer
            term="종합소득세"
            explanation="1년 동안의 사업소득 등을 합산해 다음 해 5월에 신고·납부하는 세금. 이익이 클수록 세 부담도 커집니다."
          />
          는{' '}
          <TermExplainer
            term="누진세율"
            explanation="과세표준이 높아질수록 더 높은 세율 구간이 적용되는 구조. 소득이 일정 구간을 넘어서면 그 위 금액에는 더 높은 세율이 매겨집니다."
          />
          구조라서, 소득이 늘면 단순히 세금이 비례해서 느는 게 아니라 더 가파르게 늘 수 있습니다.
        </p>
        <NumericClaim
          label="종합소득세 구조"
          value="누진세율 — 소득이 클수록 높은 구간 적용"
          basis="구조만 안내 — 구체적 세율·과세표준 구간·공제는 시점·소득에 따라 다름. 국세청 종합소득세 안내·세무사 확인 필요"
          sourceId={INCOME_TAX_ID}
        />
        <Callout tone="warning">
          가장 흔한 사고는 <span className="font-semibold">&lsquo;잘 벌던 해의 세금을 떼어 두지 않는 것&rsquo;</span>입니다.
          종합소득세는 다음 해 5월에 한꺼번에 정산되므로, 잘 번 해일수록 5월에 더 큰 세금이 나옵니다.
          벌 때마다 일부를 세금 통장에 미리 떼어 두지 않으면, 흑자인데도 납부 시기에 현금이 막힙니다.
        </Callout>
        <p className="text-sm text-ink">
          매출이 늘면 부가세 부담과 4대보험(직원 증가 시)도 함께 커집니다. &lsquo;매달 받은 부가세는 내
          돈이 아니라 맡아둔 돈&rsquo;이라는 원칙을 잘 될 때일수록 더 철저히 지키세요.
        </p>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">2. 재투자 vs 저축 — 여윳돈을 다 쓰지 않기</h3>
        <p className="text-sm text-ink">
          통장 잔고는 전부 내 이익이 아닙니다. 그 안에는 아직 내지 않은 세금과 앞으로 쓸
          재투자·예비자금이 섞여 있습니다. 여윳돈은 아래 세 갈래로 나눠 두세요.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-sm text-ink">
          <li>
            <span className="font-semibold">세금·예비자금</span> — 가장 먼저 떼어 둔다. 세금 적립과
            함께, 매출이 흔들릴 때 버틸 운전자금을 다시 채워 둡니다.
          </li>
          <li>
            <span className="font-semibold">재투자</span> — 노후 설비 교체, 핵심 품질·매장 개선처럼
            매출의 뿌리를 키우는 곳에. 단, &lsquo;있어 보이는&rsquo; 인테리어가 아니라 매출·효율로 돌아오는
            곳인지 따집니다.
          </li>
          <li>
            <span className="font-semibold">저축(내 몫)</span> — 사업과 분리된 개인 자산. 가게의
            현금흐름과 가족 생계를 끝까지 섞지 마세요.
          </li>
        </ul>
        <Caveat>
          잘 벌 때 통장 잔고만 보고 큰 지출(고급 설비·차량·확장)을 결정하면, 곧 닥칠 세금 납부월에
          현금이 마릅니다. 잔고가 아니라 &lsquo;세금·예비자금을 뺀 진짜 여윳돈&rsquo;을 기준으로 판단하세요.
        </Caveat>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">3. 2호점·다점포의 함정</h3>
        <p className="text-sm text-ink">
          2호점은 1호점의 복사가 아닙니다. 가장 큰 함정은 <span className="font-semibold">1호점의 성공이
          &lsquo;사장님이 직접 붙어 있었기 때문&rsquo;</span>인 경우입니다. 사장이 둘로 쪼개지면 두 매장 모두
          평범해질 수 있습니다.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-ink">
          <li>2호점은 별도의 초기비용·임대·인력이 다시 드는 &lsquo;새 창업&rsquo;입니다.</li>
          <li>1호점 매출이 자리를 비운 사이 흔들리면, 두 매장 모두 적자가 될 위험.</li>
          <li>사장 없이도 돌아가는 매뉴얼·점장 체제가 먼저인지부터 확인.</li>
        </ul>
        <Callout tone="info">
          확장 전에 스스로 물어보세요. <span className="font-semibold">&ldquo;1호점은 내가 없어도 돌아가는가?&rdquo;</span>
          여기에 &lsquo;아니오&rsquo;라면, 2호점이 아니라 1호점의 시스템화가 먼저입니다.
        </Callout>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">4. 번아웃·사람 관리 — 사장이 무너지면 가게가 무너진다</h3>
        <p className="text-sm text-ink">
          사장님의 체력과 판단력은 가게의 가장 중요한 자산입니다. 잘 되는 가게일수록 사장님이
          가장 오래, 가장 많이 일하기에 더 위험합니다. 번아웃은 게으름이 아니라 &lsquo;관리 실패&rsquo;로
          봐야 합니다.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-ink">
          <li>쉬는 날·근무 시간을 사장 본인에게도 정해 두기. 무한 근무는 지속되지 않습니다.</li>
          <li>핵심 업무를 매뉴얼로 만들어 직원에게 위임 — 의존도를 한 사람(나)에게서 분산.</li>
          <li>오래 일할 직원을 위한 정당한 대우(법정 근로조건 준수)가 결국 인력 안정으로 돌아옵니다.</li>
        </ul>
        <Caveat>
          잘 될 때 만든 무리한 운영(과도한 영업시간·1인 의존)은 위기 때 가장 먼저 무너집니다.
          &lsquo;지속 가능한 속도&rsquo;로 운영하는 것이 장기적으로 가장 큰 이익입니다.
        </Caveat>
      </section>

      <section className="space-y-3 rounded-xl border border-line bg-mist/40 p-4">
        <h3 className="text-base font-semibold text-ink">이제, 배운 것으로 브랜드를 비교할 차례입니다</h3>
        <p className="text-sm text-ink">
          여기까지 왔다면 창업의 준비·계약·비용·운영·대응을 한 바퀴 둘러본 셈입니다. 이제 이
          기준을 손에 쥐고, 본사가 말하는 숫자를 곧이곧대로 믿는 대신 직접 따져 보세요. 브랜드별
          비용·매출·운영 부담을 비교하며 학습을 실제 선택으로 연결할 차례입니다.
        </p>
        <CtaLink href="#compare">이제 브랜드별로 비교해보기</CtaLink>
      </section>
    </div>
  );
}
