import { Callout } from '../../components/learn/primitives/Callout';
import { Caveat } from '../../components/learn/primitives/Caveat';
import { CtaLink } from '../../components/learn/primitives/CtaLink';
import { HardStopGate } from '../../components/learn/primitives/HardStopGate';
import { NumericClaim } from '../../components/learn/primitives/NumericClaim';
import { TermExplainer } from '../../components/learn/primitives/TermExplainer';

const SOURCE_ID = 'ch1-semas-startup';

export function Chapter1() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-ink">마음가짐과 자금 준비</h2>
        <p className="text-muted">
          창업은 좋은 아이템을 고르는 일이기 전에, 내가 지금 시작해도 되는 상태인지부터
          확인하는 일입니다. 이 장에서는 시작하기 전에 스스로 점검해야 할 것과, 지금은
          멈춰야 하는 조건을 먼저 정리합니다.
        </p>
      </header>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">1. 창업 전 자가진단 — 생계형인가, 투자형인가</h3>
        <p className="text-sm text-ink">
          같은 가게라도 출발선이 다르면 결정도 달라야 합니다. 내가 어느 쪽에 가까운지 먼저
          솔직하게 적어보세요.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-ink">
          <li>
            <span className="font-semibold">생계형</span> — 이 가게에서 나오는 돈으로 당장의
            생활비를 충당해야 하는 경우. 매출이 흔들리면 곧바로 집안 살림이 흔들립니다. 그래서
            버틸 돈(예비자금)이 무엇보다 중요합니다.
          </li>
          <li>
            <span className="font-semibold">투자형</span> — 다른 소득이 있고, 여윳돈으로
            시작하는 경우. 손실을 어디까지 감당할지 미리 정해두는 것이 핵심입니다.
          </li>
        </ul>
        <Callout tone="info">
          어느 쪽이든 공통 질문은 하나입니다. <span className="font-semibold">&ldquo;잘 안 됐을 때
          나는 얼마까지 잃어도 괜찮은가?&rdquo;</span> 이 질문에 숫자로 답하지 못하면 아직 시작할
          준비가 된 것이 아닙니다.
        </Callout>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">2. 자기자본 vs 대출 — 비율의 원칙</h3>
        <p className="text-sm text-ink">
          자금을 어떻게 마련하느냐가 가게의 체력을 결정합니다. 대출 비중이 높을수록 매달
          이자가 고정비처럼 쌓여, 매출이 잠깐 흔들릴 때 버틸 힘이 줄어듭니다.
        </p>
        <NumericClaim
          label="권장 자기자본 비율"
          value="총투자금의 절반 이상"
          basis="일반 권장 기준 — 업종·규모에 따라 달라질 수 있음"
          sourceId={SOURCE_ID}
        />
        <p className="text-sm text-ink">
          즉, <span className="font-semibold">대출은 총투자금의 절반을 넘지 않도록</span> 잡는
          것이 안전한 출발선입니다. 특히 카드론·제2금융권 같은 고금리 대출로 대부분을 메우는
          구조라면 시작 시점부터 이미 위험합니다.
        </p>
        <Caveat>
          위 비율은 절대적인 정답이 아니라 일반적인 안내선입니다. 정확한 자금 계획은 본인 상황과
          금리 조건에 맞춰 세무사·금융 전문가와 함께 확인하세요.
        </Caveat>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">3. 예비 운전자금 — &lsquo;버틸 돈&rsquo;이 가게를 살린다</h3>
        <p className="text-sm text-ink">
          처음 몇 달은 거의 모든 가게가 적자이거나 손익분기점 근처입니다. 단골이 생기고 매출이
          자리 잡기까지 시간이 걸리기 때문입니다. 그동안{' '}
          <TermExplainer
            term="운전자금"
            explanation="가게를 정상적으로 굴리는 데 매달 필요한 돈. 임대료, 인건비, 재료비, 공과금, 대출이자 등 운영비와 사장님 본인의 생활비를 포함합니다."
          />
          이 떨어지면, 가게가 망해서가 아니라 버틸 돈이 없어서 문을 닫습니다.
        </p>
        <NumericClaim
          label="권장 예비 운전자금"
          value="생활비 + 운영비 6~12개월치"
          basis="일반 권장 기준 — 업종·고정비 규모에 따라 달라질 수 있음"
          sourceId={SOURCE_ID}
        />
        <p className="text-sm text-ink">
          이 돈은 창업 초기 비용과 <span className="font-semibold">별도로</span> 따로 떼어 두어야
          합니다. 초기 투자에 가진 돈을 모두 쏟아붓고 예비자금이 0이면, 첫 위기에서 버티지
          못합니다.
        </p>
        <Callout tone="warning">
          가족 생계비와 사업 자금을 한 통장에서 섞어 쓰면, 가게가 얼마를 버는지·얼마를 까먹는지
          끝까지 모르게 됩니다. 처음부터 통장과 돈을 분리하세요.
        </Callout>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">4. 프랜차이즈 vs 개인창업 — 무엇이 다른가</h3>
        <p className="text-sm text-ink">
          둘 다 정답은 아닙니다. 어떤 위험을 본사에 맡기고, 어떤 자유를 포기할지의 선택입니다.
        </p>
        <div className="space-y-3">
          <div className="rounded-xl border border-line bg-surface p-4">
            <h4 className="mb-1 text-sm font-semibold text-forest">프랜차이즈</h4>
            <p className="text-sm text-ink">
              검증된 메뉴·운영 매뉴얼·브랜드 인지도를 빌려 시작 부담이 줄어듭니다. 대신{' '}
              <TermExplainer
                term="가맹비"
                explanation="브랜드를 사용하고 본사의 운영 노하우를 제공받는 대가로 본사에 내는 초기 비용입니다."
              />
              , 로열티, 필수 구매 품목 같은 본사로 나가는 돈이 계속 발생하고, 메뉴·인테리어를
              마음대로 바꾸기 어렵습니다.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-4">
            <h4 className="mb-1 text-sm font-semibold text-forest">개인창업</h4>
            <p className="text-sm text-ink">
              모든 것을 직접 정할 수 있어 자유롭고, 본사로 나가는 비용이 없습니다. 대신 메뉴 개발,
              거래처 확보, 홍보, 운영 시행착오를 전부 혼자 감당해야 하고, 인지도를 처음부터 쌓아야
              합니다.
            </p>
          </div>
        </div>
        <Caveat>
          프랜차이즈를 고를 때 본사가 말하는 &lsquo;예상매출&rsquo;을 그대로 믿으면 안 됩니다.
          반드시 정보공개서와 가맹계약서를 직접 읽고 따져야 합니다(다음 장에서 자세히 다룹니다).
        </Caveat>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">5. 지금은 멈춰야 하는 조건</h3>
        <p className="text-sm text-ink">
          준비가 안 된 상태에서 시작하면, 의지나 노력으로 메울 수 없는 위험이 생깁니다. 아래는
          &lsquo;더 알아보기&rsquo;가 아니라 &lsquo;지금은 시작하지 않기&rsquo;를 권하는
          조건입니다.
        </p>
        <HardStopGate
          conditions={[
            '생활비 6~12개월치가 없다',
            '총투자금 대부분이 고금리 대출이다',
            '폐업 시 남는 대출·원상복구비를 감당 못 한다',
            '정보공개서·계약서를 직접 읽지 않았다',
            '예상매출을 본사 말로만 믿고 있다',
            '가족 생계비와 사업비가 섞여 있다',
          ]}
        />
      </section>

      <section className="space-y-3 rounded-xl border border-line bg-mist/40 p-4">
        <h3 className="text-base font-semibold text-ink">&ldquo;잘 안 되면 얼마를 잃는가&rdquo;</h3>
        <p className="text-sm text-ink">
          멈춤 조건의 핵심은 결국 손실입니다. 가게를 닫을 때 남는 대출, 원상복구비, 회수하지 못한
          권리금까지 합치면 생각보다 큰 돈을 잃을 수 있습니다. 구체적인 계산은 초기비용 장에서
          숫자로 따져봅니다.
        </p>
        <CtaLink href="#learn/ch4-startup-cost">최악의 경우 잃는 돈 계산 보러 가기</CtaLink>
      </section>
    </div>
  );
}
