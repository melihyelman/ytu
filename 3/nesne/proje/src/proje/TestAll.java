package proje;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)
@Suite.SuiteClasses({ DistributorTest.class, SubscriptionTest.class, IndividualTest.class, CorporationTest.class,
		DateInfoTest.class, PaymentInfoTest.class, JournalTest.class })
public class TestAll {

}
