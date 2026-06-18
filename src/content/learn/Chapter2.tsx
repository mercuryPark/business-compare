import { Callout } from '../../components/learn/primitives/Callout';
import { Caveat } from '../../components/learn/primitives/Caveat';
import { ContractQuestionList } from '../../components/learn/primitives/ContractQuestionList';
import { CtaLink } from '../../components/learn/primitives/CtaLink';
import { DecisionChecklist } from '../../components/learn/primitives/DecisionChecklist';
import { NumericClaim } from '../../components/learn/primitives/NumericClaim';
import { TermExplainer } from '../../components/learn/primitives/TermExplainer';

const SOURCE_ID = 'ch2-ftc-disclosure';

export function Chapter2() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h2 className="text-xl font-semibold text-ink">계약 전 멈춤 — 정보공개서·가맹계약서 읽기</h2>
        <p className="text-muted">
          프랜차이즈 계약은 한번 도장을 찍으면 되돌리기가 매우 어렵습니다. 그래서 계약 전에
          본사 자료를 직접 읽고, 모르는 조항은 반드시 물어봐야 합니다. 이 장은 무엇을 읽고,
          확인하고, 물어볼지를 순서대로 정리합니다.
        </p>
      </header>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">1. 정보공개서 — 가장 먼저, 직접 읽어야 할 문서</h3>
        <p className="text-sm text-ink">
          <TermExplainer
            term="정보공개서"
            explanation="가맹본부의 사업 현황, 가맹점 수, 가맹점 평균 매출, 가맹점이 부담하는 비용, 분쟁·소송 내역 등을 정해진 양식으로 적어 가맹희망자에게 제공하는 공식 문서입니다. 공정거래위원회에 등록됩니다."
          />
          는 홍보 자료가 아니라, 법에 따라 일정한 양식으로 작성해 공정거래위원회에 등록하는
          문서입니다. 등록된 정보공개서는{' '}
          <span className="font-semibold">공정위 가맹사업거래 사이트에서 누구나 조회</span>할 수
          있습니다. 본사가 준 PDF만 믿지 말고 직접 등록본을 확인하세요.
        </p>
        <NumericClaim
          label="정보공개서 사전 제공 의무"
          value="계약·가맹금 수령 전 14일 이상 전에 제공"
          basis="가맹사업법상 사전 제공 기간 — 변호사·가맹거래사 자문을 받은 경우 7일로 단축 가능"
          sourceId={SOURCE_ID}
        />
        <p className="text-sm text-ink">
          받자마자 그날 바로 계약하는 것은 정상적인 절차가 아닙니다. 충분히 읽고 따질 시간을
          주는 것이 본사의 의무입니다. 서두르라고 재촉하는 본사일수록 더 꼼꼼히 읽으세요.
        </p>
        <Callout tone="info">
          정보공개서에서 특히 볼 곳: <span className="font-semibold">① 가맹점 수의 증감(최근 몇 년간
          신규·폐점·명의변경 수)</span>, ② 가맹점 평균 매출과 그 산출 근거, ③ 가맹점이 부담하는
          비용 항목 전부, ④ 본부의 재무 상태, ⑤ 분쟁·소송·법 위반 내역. 폐점이 많은데 신규만
          강조하는 브랜드는 위험 신호입니다.
        </Callout>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">2. 예상매출액 산정서 — 본사 말 그대로 믿지 말 것</h3>
        <p className="text-sm text-ink">
          <TermExplainer
            term="예상매출액 산정서"
            explanation="본사가 가맹희망자에게 장래 예상되는 매출액의 범위와 그 산출 근거를 서면으로 제공하는 문서입니다. 일정 규모 이상의 가맹본부는 이를 서면으로 제공할 의무가 있습니다."
          />
          는 &lsquo;이 정도 벌 수 있다&rsquo;는 약속이 아니라, 예상 범위와 그 근거를 적은
          문서입니다. 핵심은 숫자 자체가 아니라{' '}
          <span className="font-semibold">그 숫자가 어떻게 나왔는가</span>입니다.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-sm text-ink">
          <li>비슷한 입지·면적의 기존 점포 실제 매출을 근거로 했는가, 아니면 본사 희망치인가?</li>
          <li>제시된 매출이 &lsquo;최고로 잘 되는 점포&rsquo; 기준은 아닌가?</li>
          <li>매출이 아니라 &lsquo;순이익&rsquo; 기준으로 다시 계산하면 얼마가 남는가?</li>
          <li>구두로만 말한 매출은 효력이 없습니다. 반드시 서면으로 받으세요.</li>
        </ul>
        <Caveat>
          예상매출은 &lsquo;예상&rsquo;일 뿐 보장이 아닙니다. 같은 브랜드라도 입지·상권·운영에
          따라 결과가 크게 갈립니다. 본사 제시 숫자는 검증 대상이지 근거가 아닙니다.
        </Caveat>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">3. 가맹계약서 체크포인트</h3>
        <p className="text-sm text-ink">
          정보공개서가 &lsquo;본사 소개서&rsquo;라면, 가맹계약서는 &lsquo;실제로 나를 묶는
          약속&rsquo;입니다. 아래 항목은 계약서에서 한 줄씩 직접 찾아 확인해야 합니다.
        </p>

        <div className="space-y-3">
          <div className="rounded-xl border border-line bg-surface p-4">
            <h4 className="mb-1 text-sm font-semibold text-forest">영업지역 보장</h4>
            <p className="text-sm text-ink">
              내 가게 근처에 같은 브랜드 매장이 또 들어올 수 있는지 확인하세요. 영업지역이
              계약서에 구체적으로(반경·행정동 등) 적혀 있어야 합니다. 본사가 일방적으로 지역을
              좁히거나 온라인·배달로 침범할 여지는 없는지 따지세요.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-4">
            <h4 className="mb-1 text-sm font-semibold text-forest">필수구매 품목과 차액가맹금</h4>
            <p className="text-sm text-ink">
              본사에서 의무적으로 사야 하는 품목이 무엇인지, 그 가격이 시중보다 비싸지 않은지
              확인하세요. 특히{' '}
              <TermExplainer
                term="차액가맹금"
                explanation="본사가 가맹점에 공급하는 물품·원재료의 가격에 일정 마진을 붙여 받는 금액. 로열티처럼 눈에 잘 띄지 않지만, 필수구매 품목을 통해 사실상 매달 본사로 나가는 비용입니다."
              />
              은 로열티처럼 드러나지 않으면서 매달 빠져나가는 돈이라 실제 부담을 키웁니다.
              필수품목 목록과 공급가가 계약서·정보공개서에 적혀 있는지 보세요.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-4">
            <h4 className="mb-1 text-sm font-semibold text-forest">위약금·중도해지</h4>
            <p className="text-sm text-ink">
              내가 중간에 그만두면 얼마를 물어내야 하는지, 본사가 계약을 해지할 수 있는 사유는
              무엇인지 확인하세요. 위약금이 과도하거나, 본사 해지 사유는 넓은데 내 해지 사유는
              거의 없는 구조라면 불리한 계약입니다.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-4">
            <h4 className="mb-1 text-sm font-semibold text-forest">계약갱신</h4>
            <p className="text-sm text-ink">
              계약 기간이 끝났을 때 같은 조건으로 갱신할 수 있는지, 갱신 시 본사가 비용을
              새로 요구하는지 확인하세요. 갱신이 보장되지 않으면 어렵게 자리 잡은 가게를
              계약 만료와 함께 잃을 수 있습니다.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-surface p-4">
            <h4 className="mb-1 text-sm font-semibold text-forest">인테리어 재시공 조건</h4>
            <p className="text-sm text-ink">
              본사 방침에 따라 일정 주기로 인테리어를 다시 해야 하는 조항이 있는지 확인하세요.
              재시공을 누가, 어떤 주기로, 누구 부담으로 하는지에 따라 큰 추가 비용이 갑자기 생길
              수 있습니다.
            </p>
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">4. 본사 상담 때 물어볼 질문</h3>
        <p className="text-sm text-ink">
          상담 자리에서 분위기에 휩쓸려 넘어가기 쉬운 항목들입니다. 아래 질문을 미리 출력해
          가서, 답을 &lsquo;말&rsquo;이 아니라 &lsquo;서면&rsquo;으로 받으세요.
        </p>
        <ContractQuestionList
          questions={[
            '제 점포의 영업지역은 계약서에 어떻게(반경·행정동 등) 적혀 있나요?',
            '제시하신 예상매출의 산출 근거는 무엇이고, 비슷한 입지 기존 점포의 실제 매출인가요?',
            '제가 의무적으로 구매해야 하는 필수품목과 공급가 목록을 서면으로 받을 수 있나요?',
            '로열티 외에 차액가맹금 등 매달 본사로 나가는 돈은 총 얼마인가요?',
            '제가 중도 해지할 경우 위약금은 얼마이고, 본사가 해지할 수 있는 사유는 무엇인가요?',
            '계약 만료 시 갱신은 보장되나요? 갱신 시 추가 비용이 있나요?',
            '인테리어 재시공 의무가 있나요? 주기와 비용 부담 주체는 누구인가요?',
            '폐점·양도 시 절차와 비용(원상복구 등)은 어떻게 되나요?',
          ]}
        />
        <Caveat>
          구두 약속은 나중에 증명하기 어렵습니다. 중요한 답변은 모두 계약서·정보공개서·서면
          확인서에 남기세요.
        </Caveat>
      </section>

      <section className="space-y-3">
        <h3 className="text-lg font-semibold text-ink">5. 계약 전 체크리스트</h3>
        <p className="text-sm text-ink">
          아래 항목을 모두 확인하기 전에는 도장을 찍지 마세요. 하나라도 비어 있다면 아직
          계약할 때가 아닙니다.
        </p>
        <DecisionChecklist
          id="contract"
          title="계약 전 체크리스트"
          items={[
            '공정위에 등록된 정보공개서 원본을 직접 조회해 읽었다',
            '정보공개서를 받은 뒤 충분한 검토 기간(법정 기간 이상)을 가졌다',
            '예상매출액 산정서를 서면으로 받고 산출 근거를 확인했다',
            '영업지역이 계약서에 구체적으로 적혀 있다',
            '필수구매 품목·공급가와 차액가맹금 등 매달 나가는 비용을 모두 파악했다',
            '중도해지 위약금과 본사·나의 해지 사유를 확인했다',
            '계약갱신 조건과 인테리어 재시공 조항을 확인했다',
            '폐점·양도 시 절차와 비용을 확인했다',
            '필요하면 가맹거래사·변호사 등 전문가의 검토를 받았다',
          ]}
        />
      </section>

      <section className="space-y-3 rounded-xl border border-line bg-mist/40 p-4">
        <h3 className="text-base font-semibold text-ink">계약서를 읽었다면, 다음은 &lsquo;장소&rsquo;입니다</h3>
        <p className="text-sm text-ink">
          좋은 계약 조건이라도 상권과 입지가 맞지 않으면 매출이 따라오지 않습니다. 다음 장에서는
          상권 보는 법, 임대차계약의 함정, 업종별 인허가 절차를 정리합니다.
        </p>
        <CtaLink href="#learn/ch3-location-license">입지·상권·임대차·인허가 보러 가기</CtaLink>
      </section>
    </div>
  );
}
